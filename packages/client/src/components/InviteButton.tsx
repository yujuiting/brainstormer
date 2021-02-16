import React, { useEffect, useState } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';
import { useBrainstormingId } from 'hooks';

export default function InviteButton(props: ButtonProps) {
  const brainstormingId = useBrainstormingId();

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1000);
    return () => clearTimeout(timer);
  }, [copied]);

  function onClick() {
    copy(`${window.location.protocol}//${window.location.host}?join=${brainstormingId}`);
    setCopied(true);
  }

  return (
    <Button onClick={onClick} {...props}>
      {copied ? 'URL Copied!' : 'Invite'}
    </Button>
  );
}

function copy(text: string) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
  console.log(text);
}
