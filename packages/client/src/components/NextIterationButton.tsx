import React from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { useIteration } from 'hooks';
import * as actions from 'store/actions';

export default function NextIterationButton(props: ButtonProps) {
  const dispatch = useDispatch();

  const iteration = useIteration();

  function onClick() {
    dispatch(actions.request.updateBrainstorming({ iteration: iteration + 1 }));
  }

  return (
    <Button onClick={onClick} {...props}>
      Next Iteration
    </Button>
  );
}
