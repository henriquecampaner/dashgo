import {
  Flex,
  Button,
  Stack,
  FormLabel,
  FormControl,
} from '@chakra-ui/react';

import { Input } from '../components/Form/Input';

export default function Home() {
  return (
    <Flex
      w="100vw"
      h="100vh"
      alignItems="center"
      justifyContent="center"
    >
      <Flex
        as="form"
        width="100%"
        maxW="360px"
        bg="gray.800"
        p="8"
        borderRadius="8px"
        flexDir="column"
      >
        <Stack spacing="4">
          <Input type="email" name="email" label="E-mail" />
          <Input type="password" name="password" label="Password" />
        </Stack>

        <Button type="submit" mt="6" colorScheme="pink" size="lg">
          Login
        </Button>
      </Flex>
    </Flex>
  );
}
