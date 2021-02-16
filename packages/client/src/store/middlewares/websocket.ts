import { Middleware } from 'redux';
import { Action } from '../types';
import * as actions from '../actions';

type Handler = (action: Action) => void;

export default function createMiddleware(): Middleware {
  return ({ dispatch }) => {
    let websocket: WebSocket | undefined;
    let handle: Handler | undefined;
    let reconnectCount = 0;

    function open() {
      dispatch(actions.connected());
    }

    function message(e: MessageEvent) {
      try {
        const action = JSON.parse(e.data);
        dispatch(action);
      } catch {
        //
      }
    }

    function connect() {
      dispatch(actions.disconnected());
      if (websocket) {
        websocket.removeEventListener('open', open);
        websocket.removeEventListener('message', message);
        websocket.removeEventListener('close', reconnect);
        websocket.removeEventListener('error', reconnect);
      }

      let url: string;
      if (window.location.protocol === 'https:') url = 'wss://';
      else url = 'ws://';
      if (window.location.host === 'localhost:3000') url += 'localhost:8080';
      else url += window.location.host;

      websocket = new WebSocket(url);
      websocket.addEventListener('open', open);
      websocket.addEventListener('message', message);
      websocket.addEventListener('close', reconnect);
      websocket.addEventListener('error', reconnect);
      handle = createHandler(websocket);
    }

    async function reconnect() {
      reconnectCount += 1;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, reconnectCount)));
      connect();
    }

    return next => (action: Action) => {
      if (action.type === '@client/connect') connect();
      if (handle) {
        if (action.type === '@notify/login-success') {
          const params = new URLSearchParams(window.location.search);
          const id = params.get('join');
          if (id) handle(actions.request.joinBrainstorming({ id }));
          else handle(actions.request.createBrainstorming());
        }
        handle(action);
      }
      next(action);
    };
  };
}

const createHandler = (websocket: WebSocket): Handler => {
  const buffer: Action[] = [];

  function flush() {
    for (const action of buffer) {
      websocket.send(JSON.stringify(action));
    }
    websocket.removeEventListener('open', flush);
  }

  websocket.addEventListener('open', flush);

  return action => {
    if (!action.type.startsWith('@request')) return;
    if (websocket.readyState === websocket.CONNECTING) {
      buffer.push(action);
    } else {
      websocket.send(JSON.stringify(action));
    }
  };
};
