import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { DateTime } from 'luxon';
import { Button, HStack, IconButton, Tooltip } from '@chakra-ui/react';
import { RepeatClockIcon } from '@chakra-ui/icons';
import { useTimer, useIsModerator } from 'hooks';
import * as actions from 'store/actions';

export default function BrainstormingTimer() {
  const dispatch = useDispatch();
  const { pause, rest } = useTimer();
  const isModerator = useIsModerator();
  const datetime = useMemo(() => DateTime.fromSeconds(rest), [rest]);

  return (
    <HStack>
      <Tooltip label={pause ? 'resume timer' : 'pause timer'}>
        <Button
          color={pause ? 'darkred' : 'orange'}
          disabled={!isModerator}
          onClick={() => {
            if (pause) dispatch(actions.request.resumeTimer());
            else dispatch(actions.request.pauseTimer());
          }}
        >
          {datetime.toLocaleString({ minute: '2-digit', second: '2-digit' })}
        </Button>
      </Tooltip>
      <Tooltip label="reset timer">
        <IconButton
          aria-label="reset"
          icon={<RepeatClockIcon />}
          disabled={!isModerator}
          onClick={() => dispatch(actions.request.resetTimer({ rest: 300 }))}
        />
      </Tooltip>
    </HStack>
  );
}
