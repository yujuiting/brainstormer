import { Card, Timer, User } from '../types';
import { createAction } from './utils';

export const loginSuccess = createAction('@notify/login-success')<{ user: User }>();

export const newParticipant = createAction('@notify/new-participant')<{ user: User }>();

export const removeParticipant = createAction('@notify/remove-participant')<{ id: string }>();

export const syncParticipants = createAction('@notify/sync-participants')<{ users: User[] }>();

export const newCard = createAction('@notify/new-card')<{ card: Card }>();

export const removeCard = createAction('@notify/remove-card')<{ id: string }>();

export const selectCard = createAction('@notify/select-card')<{ id: string }>();

export const unselectCard = createAction('@notify/unselect-card')<{ id: string }>();

export const revealCard = createAction('@notify/reveal-card')<{ id: string }>();

export const syncCards = createAction('@notify/sync-cards')<{ cards: Card[] }>();

export const syncTimer = createAction('@notify/sync-timer')<{ timer: Timer }>();

export const syncBrainstorming = createAction('@notify/sync-brainstorming')<{
  id: string;
  topic: string;
  moderatorId: string;
  iteration: number;
}>();

export const error = createAction('@notify/error')<{ message: string }>();
