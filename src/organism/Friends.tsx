import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Circle from '@/atom/Circle';
import SectionList from './SectionList';

interface Friend {
  user_id: string;
  nickname: string;
  prof_img: string;
  status?: 'online' | 'offline' | 'ingame';
  mmr?: number;
  created?: Date;
  deleted?: Date;
}

function fetcher(url: string, options: RequestInit = {}) {
  const accessToken = window.localStorage.getItem('refresh_token');

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  if (options?.body) {
    options.headers = {
      ...options.headers,
      'content-type': 'application/json',
    };
  }
  return fetch(url, options);
}

function useFriends() {
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetcher('/friend/all');

      if (res.ok) {
        setFriends(await res.json());
      }
    })();
  }, []);

  return friends;
}

function Friends() {
  // TODO: useFriends() to fetch friends list
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
  const [isOpenRequest, setIsOpenRequest] = useState<boolean>(false);

  return (
    <div
      id="friends-container"
      className="col-span-1 col-start-2 row-span-2 row-start-2
                 flex h-full w-[370px] flex-col items-start justify-start
                 border-l border-neutral-400 bg-neutral-600 font-pixel text-white"
    >
      <div className="flex h-12 w-full shrink-0 flex-row items-center justify-between border-b border-neutral-400 bg-neutral-800 px-5">
        <button
          className="flex flex-row items-center justify-start"
          onClick={() => setIsOpenForm(!isOpenForm)}
        >
          <p className="text-lg">Friends</p>
          <p className="px-1">{isOpenForm ? 'x' : '+'}</p>
        </button>
        <button onClick={() => setIsOpenRequest(!isOpenRequest)}>
          {isOpenRequest ? 'x' : '?'}
        </button>
      </div>
      {isOpenForm ? <AddFriendForm /> : null}
      {isOpenRequest ? (
        <RequestedFriendsList />
      ) : (
        <FriendsList />
      )}
    </div>
  );
}

function RequestedFriendsList() {
  return <div className="h-full w-full"></div>;
}

function FriendsList() {
  const friends = useFriends();
  const friendsData = [
    {
      title: 'online',
      list: friends.filter((friend) => friend.status !== 'offline'),
    },
    {
      title: 'offline',
      list: friends.filter((friend) => friend.status === 'offline'),
    },
  ];

  return (
    <SectionList
      sections={friendsData}
      renderItem={(friend) => <FriendItem friend={friend} />}
      keyExtractor={(friend) => friend.user_id}
    />
  );
}

interface FriendItemProps {
  friend: Friend;
  onClickItem?(friend: Friend): void;
  onClickOption?(friend: Friend): void;
}

function FriendItem({ friend, onClickOption = console.log }: FriendItemProps) {
  return (
    <div
      className="flex h-full w-full flex-row items-center justify-start
                 border-b border-neutral-400 bg-neutral-700 px-5 py-4"
    >
      <Link to={`/user/${friend.nickname}`} className="min-w-fit">
        <img
          src={friend.prof_img}
          alt="profile"
          width={65}
          height={65}
          className="rounded-full"
        />
      </Link>
      <div className="flex h-16 min-w-0 flex-col justify-around px-5">
        <p className="truncate text-base">{friend.nickname}</p>
        <div className="flex flex-row items-center space-x-2">
          <Circle
            radius={9.5}
            style={
              friend.status === 'online'
                ? 'fill-green-500'
                : friend.status === 'ingame'
                ? 'fill-amber-500'
                : 'fill-neutral-500'
            }
          />
          <p className="truncate min-w-0 text-xs">{friend.status}</p>
        </div>
      </div>
      <button
        className="ml-auto mt-2 flex h-full w-4 items-start text-lg hover:text-neutral-400"
        onClick={() => onClickOption(friend)}
      >
        :
      </button>
    </div>
  );
}

function AddFriendForm() {
  const [query, setQuery] = useState<string>('');
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (query) {
      console.log('request:', query);
      // TODO: response를 받아 사용자에게 요청 결과 알려주기.
      fetcher(`/friend/request/${query}`, { method: 'POST' });
      setQuery('');
    }
  };

  return (
    <form
      className="flex h-16 w-full shrink-0 flex-row items-center border-b border-neutral-400 bg-neutral-800"
      onSubmit={handleSubmit}
    >
      <button className="px-2" type="submit">
        +
      </button>
      <div className="flex h-full w-min items-center bg-neutral-800">
        <input
          className=" w-min border-b-4 border-white bg-inherit"
          name="q"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </form>
  );
}

export default Friends;

export { FriendsList, type Friend };
