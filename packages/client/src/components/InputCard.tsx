import React, { createElement, useState } from 'react';
import { useDispatch } from 'react-redux';
import { HStack, Input, Tooltip, IconButton, StackProps } from '@chakra-ui/react';
import { SmallAddIcon, PlusSquareIcon } from '@chakra-ui/icons';
import { Action } from 'core';
import { useIsModerator, useSelectedCards } from 'hooks';
import * as actions from 'store/actions';

enum Mode {
  Create,
  Group,
}

type ActionCreator = (content: string, children: string[]) => Action;

interface Config {
  createAction: ActionCreator;
  placeholder: string;
  tooltip: string;
  iconType: React.JSXElementConstructor<{}>;
}

const configs: Record<Mode, Config> = {
  [Mode.Create]: {
    createAction: content => actions.request.createCard({ content }),
    placeholder: 'I have an idea...',
    tooltip: 'submit',
    iconType: SmallAddIcon,
  },
  [Mode.Group]: {
    createAction: (content, children) => actions.request.groupCards({ content, children }),
    placeholder: 'Summary for cards...',
    tooltip: 'group',
    iconType: PlusSquareIcon,
  },
};

export default function InputCard(props: StackProps) {
  const dispatch = useDispatch();

  const [content, setContent] = useState('');

  const isModerator = useIsModerator();

  const selectedIdeaCards = useSelectedCards();

  const mode = isModerator && selectedIdeaCards.length >= 2 ? Mode.Group : Mode.Create;

  const { createAction, placeholder, tooltip, iconType } = configs[mode];

  function submit() {
    const children = selectedIdeaCards.map(c => c.id);
    dispatch(createAction(content, children));
    setContent('');
  }

  return (
    <HStack {...props}>
      <Input
        placeholder={placeholder}
        value={content}
        max={20}
        onChange={e => setContent(e.target.value)}
        onKeyDown={e => {
          if (e.code === 'Enter') submit();
        }}
      />
      <Tooltip label={tooltip}>
        <IconButton onClick={submit} aria-label={tooltip} icon={createElement(iconType)} />
      </Tooltip>
    </HStack>
  );
}
