import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Input, Button, Center, CenterProps, HStack, Text, VStack, Container, Heading } from '@chakra-ui/react';
import * as action from 'store/actions';

export default function DisplayName(props: CenterProps) {
  const dispatch = useDispatch();
  const [displayName, setDisplayName] = useState('');

  function submit() {
    if (!displayName) return;
    dispatch(action.request.login({ displayName }));
  }

  return (
    <Center {...props}>
      <VStack>
        <Heading>Brainstormer</Heading>
        <Container marginBottom={4}>
          <Text>Brainstorming tools for online collaboration.</Text>
        </Container>
        <HStack>
          <Input
            placeholder="Display Name"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            onKeyDown={e => {
              if (e.code === 'Enter') submit();
            }}
            autoFocus
          />
          <Button onClick={submit} disabled={!displayName}>
            Submit
          </Button>
        </HStack>
      </VStack>
    </Center>
  );
}
