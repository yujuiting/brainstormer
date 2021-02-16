import React from 'react';
import { useDispatch } from 'react-redux';
import { Box, VStack, StackProps, HStack, IconButton, Tooltip, Collapse } from '@chakra-ui/react';
import { ViewOffIcon, ViewIcon } from '@chakra-ui/icons';
import { Card } from 'core';
import { useIsModerator, useGetParticipant, useGetIdeaCards, useUserCards } from 'hooks';
import * as actions from 'store/actions';

export interface CardListProps extends StackProps {
  iteration: number;
}

export default function CardList(props: CardListProps) {
  const { iteration, ...rest } = props;

  const userCards = useUserCards(iteration);

  const dispatch = useDispatch();

  const isModerator = useIsModerator();

  const getIdeaCards = useGetIdeaCards();

  const getParticipant = useGetParticipant();

  function renderRevealButton(id: string, revealed: boolean) {
    return (
      <Tooltip label="reveal">
        <IconButton
          aria-label="reveal"
          icon={revealed ? <ViewIcon /> : <ViewOffIcon />}
          disabled={revealed || !isModerator}
          onClick={() => dispatch(actions.request.revealCard({ id }))}
        />
      </Tooltip>
    );
  }

  function renderChildrenCards(selected: boolean, children: string[]) {
    const childrenCards = getIdeaCards(...children);
    return (
      <Collapse in={selected}>
        {childrenCards.map(card => (
          <Box key={card.id}>
            {getParticipant(card.belongsTo)?.displayName}: {card.content}
          </Box>
        ))}
      </Collapse>
    );
  }

  function renderUserCards(userId: string, cards: Card[]) {
    const user = getParticipant(userId);
    return (
      <VStack key={userId} alignItems="flex-start">
        <Box>{user?.displayName}'s cards</Box>
        {cards.map(({ id, revealed, selected, content, belongsTo, children }) => {
          return (
            <HStack key={id} align="flex-start">
              {renderRevealButton(id, revealed)}
              <VStack>
                <Box
                  textAlign="left"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  onClick={() =>
                    dispatch(selected ? actions.request.unselectCard({ id }) : actions.request.selectCard({ id }))
                  }
                  background={selected ? 'Highlight' : undefined}
                  textColor={selected ? 'HighlightText' : undefined}
                  padding={2}
                  borderRadius={6}
                >
                  {revealed ? `${getParticipant(belongsTo)?.displayName}: ${content}` : 'unreveal'}
                </Box>
                {children.length > 0 && renderChildrenCards(selected, children)}
              </VStack>
            </HStack>
          );
        })}
      </VStack>
    );
  }

  return (
    <VStack align="flex-start" {...rest}>
      {Object.entries(userCards).map(([userId, cards]) => renderUserCards(userId, cards))}
    </VStack>
  );
}
