import { useQuery } from '@tanstack/react-query';
import { fetcher } from './fetcher';

export interface HistoryUser {
  user_id: string;
  nickname: string;
  prof_img: string;
  score: number;
}

export interface MatchHistory {
  game_id: string;
  winner: string;
  game_start: string;
  game_end: string;
  difficulty: 'easy' | 'normal' | 'hard';
  mode: 'rank' | '???';
  l_player: HistoryUser;
  r_player: HistoryUser;
}

export function useMatchHistory(nickname: string) {
  const data = useQuery<MatchHistory[]>({
    queryKey: ['matchHistory', nickname],
    queryFn: async () => {
      const res = await fetcher(`/history/${nickname}`);
      if (res.ok) return res.json();
      return [];
    },
  });
  return data;
}
