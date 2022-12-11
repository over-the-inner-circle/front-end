import { useQuery } from '@tanstack/react-query';
import { useFetcher } from '@/hooks/fetcher';
import { type Friend } from '@/hooks/query/friends';
import { useSetCurrentDMOpponent } from '@/hooks/dm';

export interface Message {
  sender: Friend;
  payload: string;
  created: Date;
}

export function useDirectMessages(opponent: string) {
  const fetcher = useFetcher();
  const data = useQuery<Message[]>({
    queryKey: ['dm/messages', opponent],
    queryFn: async () => {
      const res = await fetcher(`/dm/${opponent}/messages`);

      if (res.ok) {
        const data = await res.json();
        return data.messages;
      }
      return [];
    },
    refetchOnWindowFocus: false,
  });

  return data;
}

export function useSearchUser(nickname: string) {
  const fetcher = useFetcher();
  const setCurrentDMOpponent = useSetCurrentDMOpponent();

  const data = useQuery<Friend>({
    queryKey: ['user', nickname],
    queryFn: async () => {
      const res = await fetcher(`/user/${nickname}`);
      if (res.ok) return res.json();
      throw res;
    },
    onSuccess: () => {
      setCurrentDMOpponent(nickname);
    },
    enabled: !!nickname,
    retry: false,
    refetchOnWindowFocus: false,
  });
  return data;
}
