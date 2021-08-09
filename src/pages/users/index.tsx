import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Table,
  Thead,
  Tr,
  Th,
  Checkbox,
  Tbody,
  Td,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { RiAddLine } from 'react-icons/ri';
import Link from 'next/link';

import { Pagination } from '../../components/Pagination';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';

export default function UserList() {
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Users
            </Heading>

            <Link href="/users/create" passHref>
              <Button
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="pink"
                leftIcon={<Icon as={RiAddLine} fontSize="20" />}
              >
                Add
              </Button>
            </Link>
          </Flex>

          <Table colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                <Th px={['2', '4', '6']} color="gray.300" width="8">
                  <Checkbox colorScheme="pink" />
                </Th>
                <Th>User</Th>
                {isWideVersion && <Th>Date of registration</Th>}
                <Th width="8" />
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td px={['2', '4', '6']}>
                  <Checkbox colorScheme="pink" />
                </Td>
                <Td>
                  <Box>
                    <Text fontWeight="bold">Henrique Campaner</Text>
                    <Text fontSize="sm" color="gray.300">
                      henrique@campaner.com
                    </Text>
                  </Box>
                </Td>
                {isWideVersion && <Td>04 of march, 2021</Td>}
                {/* <Td>
                  <Button
                    as="a"
                    size="sm"
                    fontSize="sm"
                    colorScheme="purple"
                    leftIcon={
                      <Icon as={RiPencilLine} fontSize="16" />
                    }
                  >
                    {isWideVersion ? 'Edit' : ''}
                  </Button>
                </Td> */}
              </Tr>
            </Tbody>
          </Table>

          <Pagination />
        </Box>
      </Flex>
    </Box>
  );
}
