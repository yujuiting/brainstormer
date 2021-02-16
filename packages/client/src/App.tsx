import React, { useEffect, useRef } from 'react';
import { HStack, Flex, Heading, Link } from '@chakra-ui/react';
import Block from 'components/Block';
import ColorMode from 'components/ColorMode';
import Greeting from 'components/Greeting';
import ConnectStatus from 'components/ConnectStatus';
import BrainstormingTopic from 'components/BrainstormingTopic';
import BrainstormingTimer from 'components/BrainstormingTimer';
import ParticipantList from 'components/ParticipantList';
import CardList from 'components/CardList';
import InputCard from 'components/InputCard';
import InviteButton from 'components/InviteButton';
import GithubButton from 'components/GithubButton';
import NextIterationButton from 'components/NextIterationButton';
import ErrorModal from 'components/ErrorModal';
import { useIsBrainstorming, useIteration, useIterations, useParticipantCount } from 'hooks';

function App() {
  const isBrainstorming = useIsBrainstorming();

  const currentIteration = useIteration();

  const iterations = useIterations();

  const participantCount = useParticipantCount();

  const nextRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    nextRef.current?.scrollIntoView();
  }, [currentIteration]);

  function renderCards(iteration: number) {
    const isCurrent = iteration === currentIteration;

    const isNext = iteration === currentIteration + 1;

    return (
      <Block flexGrow={3} flexBasis={3} minWidth={320} height="100%" overflowX="hidden" key={`iteration-${iteration}`}>
        <Heading size="md" marginBottom={2} ref={isNext ? nextRef : undefined}>
          Iteration {iteration}
        </Heading>
        {isCurrent && <InputCard marginBottom={2} />}
        <CardList flexGrow={1} overflowY="auto" overflowX="hidden" iteration={iteration} />
      </Block>
    );
  }

  function renderBrainstorming() {
    return (
      <Flex padding={1} marginBottom={1} wrap="nowrap" flexGrow={1} overflow="hidden">
        <Block width={240}>
          <Flex direction="column" height="100%" overflow="hidden">
            <Heading size="md" marginBottom={2}>
              Participants ({participantCount}/6)
            </Heading>
            <ParticipantList flexGrow={1} overflowY="auto" overflowX="hidden" />
            <InviteButton width="100%" disabled={participantCount >= 6} />
          </Flex>
        </Block>
        <HStack overflowX="auto" height="100" align="flex-start">
          {iterations.map(renderCards)}
        </HStack>
      </Flex>
    );
  }

  return (
    <Flex direction="column" height="100vh">
      <Flex wrap="wrap">
        <HStack marginX={2} marginY={1}>
          <Link href="https://github.com/yujuiting/brainstormer" target="_blank">
            <GithubButton aria-label="github button" />
          </Link>
          <ConnectStatus />
          <ColorMode />
        </HStack>
        {isBrainstorming && (
          <>
            <HStack marginX={2} marginY={1}>
              <BrainstormingTimer />
              <NextIterationButton width={120} />
            </HStack>
            <BrainstormingTopic marginX={2} marginY={1} width={240} flexGrow={1} />
          </>
        )}
      </Flex>
      {isBrainstorming ? renderBrainstorming() : <Greeting flexGrow={1} />}
      <ErrorModal />
    </Flex>
  );
}

export default App;
