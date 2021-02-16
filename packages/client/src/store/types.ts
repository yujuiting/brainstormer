import { ActionCreatorsMapObject, Reducer } from '@reduxjs/toolkit';
import * as actions from './actions';
import reducer from './reducer';

type ClientAction = Omit<typeof actions, 'request' | 'notify'> extends ActionCreatorsMapObject<infer A> ? A : never;

export type Action = ClientAction | import('core').Action;

export type ActionType = Action['type'];

export type State = typeof reducer extends Reducer<infer S> ? S : never;

declare module 'react-redux' {
  interface DefaultRootState extends State {}
}
