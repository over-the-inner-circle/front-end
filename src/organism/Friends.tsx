import { useState } from 'react';
import { Link } from 'react-router-dom';
import Circle from '@/atom/Circle';

interface Friend {
  user_id: string;
  nickname: string;
  prof_img: string;
  status?: 'online' | 'offline' | 'ingame';
  mmr?: number;
  created?: Date;
  deleted?: Date;
}

const initialFriendsState: Friend[] = [
  {
    user_id: '1',
    nickname: 'nickname1',
    prof_img: 'https://via.placeholder.com/65',
    status: 'online',
    created: new Date(),
  },
  {
    user_id: '2',
    nickname: 'nickname2',
    prof_img: 'https://via.placeholder.com/65',
    status: 'ingame',
    created: new Date(),
  },
  {
    user_id: '3',
    nickname: 'tooMuchLongNickname1',
    prof_img: 'https://via.placeholder.com/65',
    status: 'offline',
    created: new Date(),
  },
];

function useFriends(initialFriends: Friend[]) {
  const [friends] = useState<Friend[]>(initialFriends);

  return friends;
}

function Friends() {
  // TODO: useFriends() to fetch friends list
  const friends = useFriends(initialFriendsState);

  return (
    <div
      id="friends-container"
      className="col-span-1 col-start-2 row-span-2 row-start-2
                 flex h-full w-[370px] flex-col items-start justify-center
                 border-l border-neutral-400 bg-neutral-600 font-pixel text-white"
    >
      <div className="flex h-14 w-full flex-row items-center border-b border-neutral-400 bg-neutral-800 px-5">
        <button className="flex flex-row items-center justify-start">
          <p className="text-lg">Friends</p>+
        </button>
      </div>
      <FriendsList friends={friends} />
    </div>
  );
}

interface FriendsListProps {
  friends: Friend[];
}

function FriendsList({ friends }: FriendsListProps) {
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
    <ul className="flex h-full w-full flex-col overflow-auto bg-neutral-600 font-pixel text-white">
      {friendsData.map((data) => (
        <>
          <li
            className="flex w-full flex-row items-center justify-start
                   border-b border-neutral-400 bg-neutral-800 px-5 py-1 text-xs"
          >
            {data.title}
          </li>
          {data.list.map((friend) => (
            <li key={friend.user_id}>
              <FriendItem friend={friend} />
            </li>
          ))}
        </>
      ))}
    </ul>
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

export default Friends;

export { FriendsList, initialFriendsState };
