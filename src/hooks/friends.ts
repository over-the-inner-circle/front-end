import { useQuery } from '@tanstack/react-query';
import { fetcher } from './fetcher';

export interface Friend {
  user_id: string;
  nickname: string;
  prof_img: string;
  status?: 'online' | 'offline' | 'ingame';
  mmr?: number;
  created?: Date;
  deleted?: Date;
}

export function useFriends() {
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['friend/all'],
    queryFn: (): Promise<Friend[]> => fetcher('friend/all'),
    select: (friends) => [
      {
        title: 'online',
        list: friends.filter((friend) => friend.status !== 'offline'),
      },
      {
        title: 'offline',
        list: friends.filter((friend) => friend.status === 'offline'),
      },
    ],
  });
  return { friends: data, error, isLoading, isError };
}

export interface RequestedFriend {
  request_id: number;
  requester: string;
  receiver: string;
  created_date: Date;
}

export function useRequestedFriends(type: 'sent' | 'recv') {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['friend/request', type],
    queryFn: (): Promise<RequestedFriend[]> =>
      fetcher(`/friend/request/${type}`),
  });
  return { data, isLoading, isError, error };
}
