import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton } from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import * as actions from 'store/actions';

export default function ConnectStatus() {
  const dispatch = useDispatch();
  const connected = useSelector(s => s.app.connected);

  useEffect(() => {
    if (!connected) dispatch(actions.connect());
  }, [connected, dispatch]);

  return (
    <IconButton
      onClick={() => dispatch(actions.connect())}
      aria-label="connect status"
      icon={connected ? <CheckIcon /> : <CloseIcon />}
    />
  );
}
