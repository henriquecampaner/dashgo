import { Flex, Box, Text, Avatar } from '@chakra-ui/react';

interface ProfileProps {
  showProfileData?: boolean;
}

export function Profile({ showProfileData = true }: ProfileProps) {
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

      <Avatar
        size="md"
        name="Henrique Campaner"
        src="https://github.com/henriquecampaner.png"
      />
    </Flex>
  );
}