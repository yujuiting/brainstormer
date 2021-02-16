import { createAction } from './utils';

export const login = createAction('@request/login')<{ displayName: string }>();

export const logout = createAction('@request/logout')();

export const createBrainstorming = createAction('@request/create-brainstorming')();

export const updateBrainstorming = createAction('@request/update-brainstorming')<{
  moderatorId?: string;
  topic?: string;
  iteration?: number;
}>();

export const joinBrainstorming = createAction('@request/join-brainstorming')<{ id: string }>();

export const createCard = createAction('@request/create-card')<{ content: string }>();

export const removeCard = createAction('@request/remove-card')<{ id: string }>();

export const revealCard = createAction('@request/reveal-card')<{ id: string }>();

export const selectCard = createAction('@request/select-card')<{ id: string }>();

export const unselectCard = createAction('@request/unselect-card')<{ id: string }>();

export const groupCards = createAction('@request/group-cards')<{ content: string; children: string[] }>();

export const resetTimer = createAction('@request/reset-timer')<{ rest: number }>();

export const pauseTimer = createAction('@request/pause-timer')();

export const resumeTimer = createAction('@request/resume-timer')();
