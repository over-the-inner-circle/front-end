import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { fetcher } from '@/hooks/fetcher';
import { currentDMOpponentState } from '@/states/currentDMOpponent';
import SideBarHeader from '@/molecule/SideBarHeader';
import SideBarLayout from '@/molecule/SideBarLayout';
import DirectmsgRoom from './DirectmsgRoom';
import { Friend } from '@/hooks/friends';

const Directmsg = () => {
  const [currentDMOpponent, setCurrentDMOpponent] = useRecoilState(
    currentDMOpponentState,
  );

  return (
    <SideBarLayout>
      {currentDMOpponent ? (
        <DirectmsgRoom
          opponent={currentDMOpponent}
          close={() => setCurrentDMOpponent(null)}
        />
      ) : (
        <DirectmsgList />
      )}
    </SideBarLayout>
  );
};

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
  });
  return data;
}

function DirectmsgList() {
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
      <SideBarHeader>Direct Message</SideBarHeader>
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-row items-center gap-2 p-3"
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
        <div className="flex w-full items-center justify-center text-xs text-red-500">
          <p>Not Found</p>
        </div>
      ) : null}
    </>
  );
}

export default Directmsg;
