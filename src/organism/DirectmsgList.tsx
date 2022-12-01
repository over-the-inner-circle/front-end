import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { fetcher } from '@/hooks/fetcher';
import { sortedDmHistoryState } from '@/states/dmHistoryState';
import { currentDMOpponentState } from '@/states/currentDMOpponent';
import SideBarHeader from '@/molecule/SideBarHeader';
import StatusIndicator from '@/molecule/StatusIndicator';
import type { Friend } from '@/hooks/friends';

function DirectmsgList() {
  const setCurrentDMOpponent = useSetRecoilState(currentDMOpponentState);
  const dmHistory = useRecoilValue(sortedDmHistoryState);

  return (
    <>
      <SideBarHeader>Direct Message</SideBarHeader>
      <AddDirectmsgForm />
      <ul className="w-full border-t border-neutral-400">
        {dmHistory.map((dmInfo) => (
          <li key={dmInfo.opponent.user_id} className="w-full bg-neutral-700">
            <button
              className="flex w-full flex-col gap-1 border-b border-neutral-400 p-3 px-5"
              onClick={() => setCurrentDMOpponent(dmInfo.opponent.nickname)}
            >
              <p>{dmInfo.opponent.nickname}</p>
              <div className="flex flex-row items-center space-x-2">
                <StatusIndicator status={dmInfo.opponent.status} />
                <p className="min-w-0 truncate text-xs">
                  {dmInfo.opponent.status ?? 'unknown'}
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

function useSearchUser(nickname: string) {
  const setCurrentDMOpponent = useSetRecoilState(currentDMOpponentState);

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

function AddDirectmsgForm() {
  const [nickname, setNickname] = useState('');
  const [query, setQuery] = useState('');
  const { isFetching, isError } = useSearchUser(query);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (nickname) {
      setQuery(nickname);
    }
  };
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-row items-center gap-2 bg-neutral-800 p-3"
      >
        <label htmlFor="nickname">To.</label>
        <input
          className="w-full bg-neutral-700 p-1 disabled:opacity-20"
          name="nickname"
          type="search"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          disabled={isFetching}
          required
        />
        <button
          className="disabled:opacity-20"
          type="submit"
          disabled={isFetching}
        >
          Q
        </button>
      </form>
      {isError ? (
        <div className="flex w-full items-center justify-center bg-neutral-800 pb-2 text-xs text-red-500">
          <p>Not Found</p>
        </div>
      ) : null}
    </>
  );
}

export default DirectmsgList;