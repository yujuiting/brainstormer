import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Input, InputProps } from '@chakra-ui/react';
import * as actions from 'store/actions';
import { useIsModerator } from 'hooks';

export default function BrainstormingTopic(props: InputProps) {
  const dispatch = useDispatch();
  const name = useSelector(s => s.brainstorming.topic);
  const isModerator = useIsModerator();

  return (
    <Input
      placeholder="What's our problem?"
      value={name}
      onChange={e => dispatch(actions.request.updateBrainstorming({ topic: e.target.value }))}
      disabled={!isModerator}
      {...props}
    />
  );
}
