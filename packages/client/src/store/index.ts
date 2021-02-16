import { configureStore } from '@reduxjs/toolkit';
import reducer from './reducer';
import websocket from './middlewares/websocket';

export const store = configureStore({ reducer, middleware: [websocket()] });
