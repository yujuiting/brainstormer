import React from 'react';
import { IconButton, IconButtonProps, Image, useColorModeValue } from '@chakra-ui/react';

export default function GithubButton(props: IconButtonProps) {
  const src = useColorModeValue('assets/GitHub-Mark-64px.png', 'assets/GitHub-Mark-Light-64px.png');
  return (
    <IconButton {...props}>
      <Image src={src} alt="github" width={8} />
    </IconButton>
  );
}
