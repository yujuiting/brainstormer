import React from 'react';
import { Box, VStack, HStack, StackProps } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { User } from 'core';
import { useParticipants, useModeratorId } from 'hooks';

export default function ParticipantList(props: StackProps) {
  const participants = useParticipants();
  const moderatorId = useModeratorId();

  function renderIcon(user: User) {
    if (user.id === moderatorId) return <StarIcon />;
    return null;
  }

  return (
    <VStack align="flex-start" {...props}>
      {participants.map(participant => (
        <HStack key={participant.id}>
          {renderIcon(participant)}
          <Box marginLeft={6}>{participant.displayName}</Box>
        </HStack>
      ))}
    </VStack>
  );
}
