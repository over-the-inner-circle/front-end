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
      status: 'online',
      created: new Date(),
    },
    {
      user_id: '3',
      nickname: 'nickname3',
      prof_img: 'https://via.placeholder.com/65',
      status: 'online',
      created: new Date(),
    },
]

function Friends(props: React.HTMLAttributes<HTMLDivElement>) {
  const friends: Friend[] = initialFriendsState;

  return (
    <div
      {...props}
      id="sidebar-container"
      className="w-[370px] h-full px-5 py-3 bg-blue-500 font-pixel flex flex-col
                 col-span-1 row-span-2 col-start-2 row-start-2"
    >
      <div className="flex flex-row items-center pb-3 pl-0.5">
        <button className="flex flex-row justify-start items-center">
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
  return (
    <ul className="flex flex-col gap-2 h-full overflow-auto">
      {friends.map((friend) => (
        <li
          key={friend.user_id}
          className="h-[65px] flex flex-row items-center my-1"
        >
          <a href={`/user/${friend.nickname}`}>
            <img
              src={friend.prof_img}
              alt="profile"
              className="mr-2 rounded-full"
            />
          </a>
          <div className="h-full px-2 flex flex-col justify-around">
            <div>{friend.nickname}</div>
            <div className="text-xs">{friend.status}</div>
          </div>
          <p className="ml-auto">:</p>
        </li>
      ))}
    </ul>
  );
}

export default Friends;
