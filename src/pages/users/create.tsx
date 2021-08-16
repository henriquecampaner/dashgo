import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { Input } from '../../components/Form/Input';
import Link from 'next/link';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { SubmitHandler } from 'react-hook-form';
import { useMutation } from 'react-query';
import { api } from '../../services/api';
import { queryClient } from '../../services/queryClient';
import { useRouter } from 'next/router';
import { withSSRAuth } from '../../utils/withSSRAuth';

type CreateUserFormData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

const createUserFormSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup
    .string()
    .required('E-mail is required')
    .email('Email invalid'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Minimum 6 characters'),
  password_confirmation: yup
    .string()
    .oneOf([null, yup.ref('password')], 'Password must to match'),
});

export default function CreateUser() {
  const router = useRouter();

  const createUser = useMutation(
    async (user: CreateUserFormData) => {
      const response = await api.post('users', {
        user: {
          ...user,
          created_at: new Date(),
        },
      });

      return response.data.user;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
      },
    }
  );

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createUserFormSchema),
  });

  const { errors } = formState;

  const handleCreateUser: SubmitHandler<CreateUserFormData> = async (
    values
  ) => {
    await createUser.mutateAsync(values);
    router.push('/users');
  };

  return (
    <Box>
      <Header />
      <Flex as="main" w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Sidebar />

        <Box
          as="form"
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p={['6', '8']}
          onSubmit={handleSubmit(handleCreateUser)}
        >
          <Heading size="lg" fontWeight="normal">
            Create user
          </Heading>

          <Divider my="6" borderColor="gray.red.700" />

          <VStack spacing="8">
            <SimpleGrid
              minChildWidth="240px"
              spacing={['6', '8']}
              w="100%"
            >
              <Input
                error={errors.name}
                {...register('name')}
                name="name"
                type="text"
                label="Name"
              />
              <Input
                error={errors.email}
                {...register('email')}
                name="email"
                type="email"
                label="Email"
              />
            </SimpleGrid>
            <SimpleGrid
              minChildWidth="240px"
              spacing={['6', '8']}
              w="100%"
            >
              <Input
                error={errors.password}
                {...register('password')}
                name="password"
                type="password"
                label="Password"
              />
              <Input
                error={errors.password_confirmation}
                {...register('password_confirmation')}
                name="password_confirmation"
                type="password"
                label="Confirm password"
              />
            </SimpleGrid>
          </VStack>

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/users" passHref>
                <Button colorScheme="whiteAlpha">Cancel</Button>
              </Link>
              <Button
                type="submit"
                isLoading={formState.isSubmitting}
                colorScheme="pink"
              >
                Save
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  {
    permissions: ['users.create'],
    roles: ['administrator'],
  }
);
