import path from 'path';
import Koa from 'koa';
import koaStatic from 'koa-static';
import KoaRouter from 'koa-router';
import websockify from 'koa-websocket';
import WebSocket from 'ws';
import { nanoid } from 'nanoid';
import { actions, Action, User } from 'core';
import Brainstorming from './Brainstorming';

const server = websockify(new Koa());

const userStates = new Map<string, { user: User; websocket: WebSocket; brainstormingId?: string }>();

const brainstormings = new Map<string, Brainstorming>();

server.listen(8080);

server.use(koaStatic(path.resolve(__dirname, '../../client/build')));

const httpRouter = new KoaRouter();

httpRouter.get('/health', ctx => (ctx.body = 'health'));

server.use(httpRouter.routes()).use(httpRouter.allowedMethods());

server.ws.use(({ websocket }) => {
  websocket.once('message', message => handleFirstMessage(websocket, message));

  websocket.on('error', console.error);

  websocket.on('unexpected-response', console.warn);
});

function handleFirstMessage(websocket: WebSocket, message: unknown) {
  if (typeof message !== 'string') return;

  const firstAction: Action = JSON.parse(message);

  switch (firstAction.type) {
    case '@request/login': {
      const user: User = { id: nanoid(), displayName: firstAction.payload.displayName };
      userStates.set(user.id, { user, websocket });
      websocket.on('message', message => handleMessage(websocket, message, user));
      websocket.on('close', () => {
        handleMessage(websocket, JSON.stringify(actions.request.logout()), user);
        websocket.removeAllListeners();
      });
      websocket.send(JSON.stringify(actions.notify.loginSuccess({ user })));
      break;
    }
  }
}

function handleMessage(websocket: WebSocket, message: unknown, user: User) {
  if (typeof message !== 'string') return;

  const action: Action = JSON.parse(message);

  switch (action.type) {
    case '@request/logout': {
      const userState = userStates.get(user.id);
      userStates.delete(user.id);
      if (!userState || !userState.brainstormingId) break;
      const brainstorming = brainstormings.get(userState.brainstormingId);
      if (!brainstorming) break;
      brainstorming.removeParticipant(user.id);
      if (!brainstorming.getModerator()) {
        brainstormings.delete(brainstorming.id);
      }
      break;
    }

    case '@request/create-brainstorming': {
      const userState = userStates.get(user.id);
      if (!userState) break;
      const brainstorming = new Brainstorming();
      if (!brainstormings.has(brainstorming.id)) {
        brainstormings.set(brainstorming.id, brainstorming);
        brainstorming.addParticipant(websocket, user);
        userState.brainstormingId = brainstorming.id;
      } else {
        websocket.send(JSON.stringify(actions.notify.error({ message: 'please try again.' })));
      }
      break;
    }

    case '@request/join-brainstorming': {
      const userState = userStates.get(user.id);
      if (!userState) break;
      const brainstorming = brainstormings.get(action.payload.id);
      if (!brainstorming) break;
      if (brainstorming.countParticipants() < 6) {
        userState.brainstormingId = action.payload.id;
        brainstorming.addParticipant(websocket, user);
      } else {
        websocket.send(JSON.stringify(actions.notify.error({ message: 'reach participants limit' })));
      }
      break;
    }
  }
}
