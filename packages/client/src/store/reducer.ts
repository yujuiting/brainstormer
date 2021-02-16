import { createReducer, combineReducers } from '@reduxjs/toolkit';
import { BrainstormingState, User } from 'core';
import * as actions from './actions';

const app = createReducer(
  {
    connected: false,
    user: null as User | null,
    error: { message: '' },
  },
  ({ addCase }) => {
    addCase(actions.connected, state => {
      state.connected = true;
    });
    addCase(actions.disconnected, state => {
      state.connected = false;
    });
    addCase(actions.clearErrorMessage, state => {
      state.error.message = '';
    });
    addCase(actions.notify.loginSuccess, (state, action) => {
      state.user = action.payload.user;
    });
    addCase(actions.notify.error, (state, { payload: { message } }) => {
      state.error.message = message;
    });
  },
);

const defaultBrainstormingState: BrainstormingState = {
  id: '',
  topic: '',
  moderatorId: '',
  iteration: 0,
  participants: [],
  cards: [],
  timer: { pause: true, rest: 300 },
};

export const brainstorming = createReducer(defaultBrainstormingState, ({ addCase }) => {
  /**
   * Notify
   */
  addCase(actions.notify.newParticipant, (state, { payload: { user } }) => {
    state.participants.push(user);
  });
  addCase(actions.notify.removeParticipant, (state, { payload: { id } }) => {
    const index = state.participants.findIndex(user => user.id === id);
    if (index < 0) return;
    state.participants.splice(index, 1);
  });
  addCase(actions.notify.syncParticipants, (state, { payload: { users } }) => {
    state.participants = users;
  });
  addCase(actions.notify.newCard, (state, { payload: { card } }) => {
    state.cards.push(card);
  });
  addCase(actions.notify.removeCard, (state, { payload: { id } }) => {
    const index = state.cards.findIndex(card => card.id === id);
    if (index < 0) return;
    state.cards.splice(index, 1);
  });
  addCase(actions.notify.selectCard, (state, { payload: { id } }) => {
    const index = state.cards.findIndex(card => card.id === id);
    if (index < 0) return;
    state.cards[index].selected = true;
  });
  addCase(actions.notify.unselectCard, (state, { payload: { id } }) => {
    const index = state.cards.findIndex(card => card.id === id);
    if (index < 0) return;
    state.cards[index].selected = false;
  });
  addCase(actions.notify.revealCard, (state, { payload: { id } }) => {
    const index = state.cards.findIndex(card => card.id === id);
    if (index < 0) return;
    state.cards[index].revealed = true;
  });
  addCase(actions.notify.syncCards, (state, { payload: { cards } }) => {
    state.cards = cards;
  });
  addCase(actions.notify.syncTimer, (state, { payload: { timer } }) => {
    state.timer = timer;
  });
  addCase(actions.notify.syncBrainstorming, (state, { payload: { id, topic, moderatorId, iteration } }) => {
    state.id = id;
    state.topic = topic;
    state.moderatorId = moderatorId;
    state.iteration = iteration;
  });
});

export default combineReducers({ app, brainstorming });
