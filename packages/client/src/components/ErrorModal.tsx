import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalOverlay, Container } from '@chakra-ui/react';
import { useErrorMessage } from 'hooks';

export default function ErrorModal() {
  const [errorMessage, clearErrorMessage] = useErrorMessage();
  return (
    <Modal isOpen={!!errorMessage} onClose={clearErrorMessage}>
      <ModalOverlay />
      <ModalHeader>Error</ModalHeader>
      <ModalContent>
        <Container padding={2}>{errorMessage}</Container>
      </ModalContent>
    </Modal>
  );
}
