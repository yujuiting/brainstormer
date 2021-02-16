import { nanoid } from 'nanoid';
import WebSocket from 'ws';
import { User, Card, Action, ActionType, actions } from 'core';

const moderatorActionType: ActionType[] = [
  '@request/pause-timer',
  '@request/reset-timer',
  '@request/resume-timer',
  '@request/remove-card',
  '@request/select-card',
  '@request/unselect-card',
  '@request/group-cards',
  '@request/reveal-card',
  '@request/update-brainstorming',
];

export default class Brainstorming {
  readonly id = nanoid(6);

  private websockets = new Map<string, WebSocket>();

  private topic = '';

  private moderatorId = '';

  private iteration = 0;

  private participants: User[] = [];

  private cards: Card[] = [];

  private timer = { pause: true, rest: 300 };

  private timerHandle: NodeJS.Timer | null = null;

  constructor() {
    console.log('new brainstorming created', this.id);
  }

  getModerator() {
    if (!this.moderatorId) return;
    return this.participants.find(user => user.id === this.moderatorId);
  }

  addParticipant(websocket: WebSocket, user: User) {
    if (!this.moderatorId) this.moderatorId = user.id;

    this.participants.push(user);

    this.websockets.set(user.id, websocket);

    websocket.on('message', message => this.handleMessage(user, message));

    this.broadcast(actions.notify.newParticipant({ user }), [user.id]);

    const { cards, timer } = this;

    this.syncBrainstorming(user.id);

    this.send(user.id, actions.notify.syncCards({ cards }));

    this.send(user.id, actions.notify.syncTimer({ timer }));

    this.send(user.id, actions.notify.syncParticipants({ users: this.participants }));
  }

  removeParticipant(id: string) {
    const index = this.participants.findIndex(user => user.id === id);

    if (index < 0) return;

    const user = this.participants[index];

    this.participants.splice(index, 1);

    if (user.id === this.moderatorId) this.moderatorId = this.participants[0]?.id || '';

    this.broadcast(actions.notify.removeParticipant({ id }));

    this.syncBrainstorming();
  }

  countParticipants() {
    return this.participants.length;
  }

  resumeTimer() {
    if (this.timerHandle) return;
    this.timer.pause = false;
    this.timerHandle = setInterval(() => {
      this.timer.rest -= 1;
      this.broadcast(actions.notify.syncTimer({ timer: this.timer }));
    }, 1000);
  }

  pauseTimer() {
    if (!this.timerHandle) return;
    this.timer.pause = true;
    clearInterval(this.timerHandle);
    this.timerHandle = null;
    this.broadcast(actions.notify.syncTimer({ timer: this.timer }));
  }

  resetTimer(rest: number) {
    this.pauseTimer();
    this.timer.rest = rest;
    this.broadcast(actions.notify.syncTimer({ timer: this.timer }));
  }

  createCard(belongsTo: string, content: string, children: string[] = []) {
    const card: Card = {
      id: nanoid(),
      content,
      belongsTo,
      selected: false,
      revealed: children.length > 0,
      children,
      iteration: children.length > 0 ? this.iteration + 1 : this.iteration,
    };

    this.cards.push(card);

    this.broadcast(actions.notify.newCard({ card }));

    children.forEach(id => this.unselectCard(id));
  }

  removeCard(id: string) {
    const index = this.cards.findIndex(card => card.id === id);
    if (index < 0) return;
    this.cards.splice(index, 1);
    this.broadcast(actions.notify.removeCard({ id }));
  }

  selectCard(id: string) {
    const index = this.cards.findIndex(card => card.id === id);
    if (index < 0) return;
    this.cards[index].selected = true;
    this.broadcast(actions.notify.selectCard({ id }));
  }

  unselectCard(id: string) {
    const index = this.cards.findIndex(card => card.id === id);
    if (index < 0) return;
    this.cards[index].selected = false;
    this.broadcast(actions.notify.unselectCard({ id }));
  }

  revealCard(id: string) {
    const index = this.cards.findIndex(card => card.id === id);
    if (index < 0) return;
    this.cards[index].revealed = false;
    this.broadcast(actions.notify.revealCard({ id }));
  }

  broadcast(message: Action, ignoreIds: string[] = []) {
    const data = JSON.stringify(message);
    this.websockets.forEach((websocket, id) => {
      if (ignoreIds.includes(id)) return;
      websocket.send(data, err => {
        if (!err) return;
        console.error('send fail', err);
      });
    });
  }

  send(id: string, message: Action) {
    const websocket = this.websockets.get(id);
    if (!websocket) {
      console.log('send fail', 'not found websocket');
      return;
    }
    websocket.send(JSON.stringify(message), err => {
      if (!err) return;
      console.error('send fail', err);
    });
  }

  syncBrainstorming(user?: string) {
    const { id, topic, moderatorId, iteration } = this;
    if (user) this.send(user, actions.notify.syncBrainstorming({ id, topic, moderatorId, iteration }));
    else this.broadcast(actions.notify.syncBrainstorming({ id, topic, moderatorId, iteration }));
  }

  handleMessage(user: User, message: unknown) {
    if (typeof message !== 'string') return;

    const action: Action = JSON.parse(message);

    // check permission
    if (moderatorActionType.includes(action.type)) {
      if (user.id !== this.moderatorId) return;
    }

    switch (action.type) {
      case '@request/reset-timer':
        return this.resetTimer(action.payload.rest);
      case '@request/pause-timer':
        return this.pauseTimer();
      case '@request/resume-timer':
        return this.resumeTimer();
      case '@request/create-card':
        return this.createCard(user.id, action.payload.content);
      case '@request/remove-card':
        return this.removeCard(action.payload.id);
      case '@request/select-card':
        return this.selectCard(action.payload.id);
      case '@request/unselect-card':
        return this.unselectCard(action.payload.id);
      case '@request/reveal-card':
        return this.revealCard(action.payload.id);
      case '@request/group-cards':
        return this.createCard(user.id, action.payload.content, action.payload.children);
      case '@request/update-brainstorming': {
        const { topic, moderatorId, iteration } = action.payload;
        if (topic) this.topic = topic;
        if (moderatorId) this.moderatorId = moderatorId;
        if (iteration) this.iteration = iteration;
        this.syncBrainstorming();
        return;
      }
    }
  }
}
