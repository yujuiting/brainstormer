import { Box, BoxProps } from '@chakra-ui/react';

export default function Block({ children, ...props }: BoxProps) {
  return (
    <Box borderColor="gray.700" borderWidth={1} borderRadius={6} padding={2} marginX={1} {...props}>
      {children}
    </Box>
  );
}
