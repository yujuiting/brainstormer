import { createAction } from '@reduxjs/toolkit';
import { actions } from 'core';

export const connect = createAction<void, '@client/connect'>('@client/connect');

export const connected = createAction<void, '@client/connected'>('@client/connected');

export const disconnected = createAction<void, '@client/disconnected'>('@client/disconnected');

export const clearErrorMessage = createAction<void, '@client/clear-error-message'>('@client/clear-error-message');

export const { request, notify } = actions;
