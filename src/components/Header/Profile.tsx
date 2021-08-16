import { Flex, Box, Text, Avatar, Button } from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileProps {
  showProfileData?: boolean;
  name: string;
  email: string;
}

export function Profile({
  showProfileData = true,
  name,
  email,
}: ProfileProps) {
  const { signOut } = useAuth();
  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>Henrique Campaner</Text>
          <Text color="gray.300" fontSize="small">
            henrique@campaner.live
          </Text>
        </Box>
      )}

      <Flex direction={['column', 'row']} alignItems="center">
        <Avatar
          size="md"
          name="Henrique Campaner"
          src="https://github.com/henriquecampaner.png"
        />

        <Button
          ml={['0', '8']}
          mt={['2', undefined]}
          colorScheme="red"
          onClick={signOut}
        >
          Sign out
        </Button>
      </Flex>
    </Flex>
  );
}
