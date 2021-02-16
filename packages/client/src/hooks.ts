import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from 'core';
import * as actions from 'store/actions';

export function useDisplayName() {
  return useSelector(s => s.app.user?.displayName);
}

export function useIsModerator() {
  return useSelector(s => s.brainstorming.moderatorId === s.app.user?.id);
}

export function useIsBrainstorming() {
  return useSelector(s => !!s.brainstorming.moderatorId);
}

export function useModeratorId() {
  return useSelector(s => s.brainstorming.moderatorId);
}

export function useParticipants() {
  return useSelector(s => s.brainstorming.participants);
}

export function useParticipantCount() {
  return useSelector(s => s.brainstorming.participants.length);
}

export function useGetParticipant() {
  const participants = useParticipants();
  return useCallback((id: string) => participants.find(user => user.id === id), [participants]);
}

export function useTimer() {
  return useSelector(s => s.brainstorming.timer);
}

export function useUserCards(iteration: number) {
  return useSelector(s =>
    s.brainstorming.cards
      .filter(card => card.iteration === iteration)
      .reduce(
        (result, card) => ({
          ...result,
          [card.belongsTo]: [...(result[card.belongsTo] || []), card],
        }),
        {} as Record<string, Card[]>,
      ),
  );
}

export function useGetIdeaCards() {
  const cards = useSelector(s => s.brainstorming.cards);
  return useCallback((...ids: string[]) => cards.filter(card => ids.includes(card.id)), [cards]);
}

export function useSelectedCards() {
  return useSelector(s => s.brainstorming.cards.filter(card => card.selected));
}

export function useBrainstormingId() {
  return useSelector(s => s.brainstorming.id);
}

export function useIteration() {
  return useSelector(s => s.brainstorming.iteration);
}

export function useIterations() {
  return useSelector(s => Array.from({ length: s.brainstorming.iteration + 2 }).map((_, index) => index));
}

export function useErrorMessage() {
  const dispatch = useDispatch();
  return [
    useSelector(s => s.app.error.message),
    useCallback(() => dispatch(actions.clearErrorMessage()), [dispatch]),
  ] as const;
}
