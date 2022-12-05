import { accessTokenState } from '@/states/user/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';
import { useFetcher } from './fetcher';

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
  const fetcher = useFetcher();
  const accessToken = useRecoilValue(accessTokenState);

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['friend/all'],
    queryFn: async (): Promise<Friend[]> => {
      const res = await fetcher('/friend/all');
      if (res.ok) return res.json();
      return [];
    },
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
    enabled: !!accessToken,
  });
  return { friends: data, error, isLoading, isError };
}

export function useDeleteFriend() {
  const fetcher = useFetcher();
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (friend: Friend) => {
      return fetcher(`/friend/${friend.nickname}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friend/all'] });
    },
  });

  return deleteMutation;
}

export interface RequestedFriend {
  request_id: number;
  user_info: Friend;
  created_date: Date;
}

export function useRequestedFriends(type: 'sent' | 'recv') {
  const fetcher = useFetcher();
  const data = useQuery({
    queryKey: ['friend/request', type],
    queryFn: async (): Promise<RequestedFriend[]> => {
      const res = await fetcher(`/friend/request/${type}`);
      if (res.ok) return res.json();
      return [];
    },
  });
  return data;
}
