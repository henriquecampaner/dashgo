import {
  Flex,
  Icon,
  IconButton,
  useBreakpointValue,
} from '@chakra-ui/react';
import { Profile } from './Profile';
import { NotificationsNav } from './NotificationsNav';
import { SearchBox } from './SearchBox';
import { Logo } from './Logo';
import { useSidebarDrawer } from '../../contexts/SidebarDrawerContext';
import { RiMenuLine } from 'react-icons/ri';
import { useAuth } from '../../contexts/AuthContext';

export function Header() {
  const { user } = useAuth();
  const { onOpen } = useSidebarDrawer();

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  return (
    <Flex
      w="100%"
      as="header"
      maxWidth={1480}
      h="20"
      mx="auto"
      mt="4"
      alignContent="center"
      px="6"
      align="center"
    >
      {!isWideVersion && (
        <IconButton
          icon={<Icon as={RiMenuLine} />}
          fontSize="24"
          variant="unstyled"
          onClick={onOpen}
          aria-label="open navigation"
          mr="2"
        ></IconButton>
      )}

      <Logo />

      {isWideVersion && <SearchBox />}

      <Flex align="center" ml="auto">
        <NotificationsNav />

        <Profile
          name={user.name}
          email={user.email}
          showProfileData={isWideVersion}
        />
      </Flex>
    </Flex>
  );
}
