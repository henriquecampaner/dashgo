import { useQuery } from 'react-query';
import { api } from '../api';

type User = {
  id: string;
  name: string;
  email: string;
  created_at: string;
};

type GetUserResponse = {
  totalCount: number;
  users: User[];
};

export async function getUsers(
  page: number
): Promise<GetUserResponse> {
  const { data, headers } = await api.get('users', {
    params: {
      page: page,
    },
  });

  const totalCount = Number(headers['x-total-count']);

  const users = data.users.map((user: User) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: new Date(user.created_at).toLocaleDateString('en-gb', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
  }));

  console.log(users);

  return {
    users,
    totalCount,
  };
}

export function useUsers(page: number) {
  return useQuery(['users', page], () => getUsers(page), {
    staleTime: 1000 * 5, // 5 seconds
  });
}
