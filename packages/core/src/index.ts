import { ActionCreatorsMapObject } from '@reduxjs/toolkit';

type Actions = typeof import('./actions/request') | typeof import('./actions/notify');

export type Action = Actions extends ActionCreatorsMapObject<infer A> ? A : never;

export type ActionType = Action['type'];

export * as actions from './actions';

export * from './types';
