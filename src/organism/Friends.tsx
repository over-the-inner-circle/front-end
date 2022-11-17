import { useState } from 'react';
import { Link } from 'react-router-dom';
import Circle from '@/atom/Circle';
import SectionList from './SectionList';
import { useMutation, useQuery } from '@tanstack/react-query';
import SideBarLayout from './SideBarLayout';
import Spinner from '@/atom/Spinner';
import {
  useFloating,
  useInteractions,
  useClick,
  useDismiss,
  useRole,
  autoUpdate,
  offset,
  flip,
  shift,
  FloatingPortal,
} from '@floating-ui/react-dom-interactions';

interface Friend {
  user_id: string;
  nickname: string;
  prof_img: string;
  status?: 'online' | 'offline' | 'ingame';
  mmr?: number;
  created?: Date;
  deleted?: Date;
}

async function fetcher(url: string, options: RequestInit = {}) {
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

  const res = await fetch(url, options);
  return res.json();
}

function useFriends() {
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

function useRequestedFriends(type: 'sent' | 'recv') {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['friend/request', type],
    queryFn: (): Promise<RequestedFriend[]> =>
      fetcher(`/friend/request/${type}`),
  });
  return { data, isLoading, isError, error };
}

function Friends() {
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
  const [isOpenRequest, setIsOpenRequest] = useState<boolean>(false);

  return (
    <SideBarLayout>
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
      {isOpenRequest ? <RequestedFriendsList /> : <FriendsList />}
    </SideBarLayout>
  );
}

function RequestedFriendsList() {
  const sentFriends = useRequestedFriends('sent');
  const recvFriends = useRequestedFriends('recv');

  const requestedData = [
    {
      title: 'recv',
      list: recvFriends.data,
    },
    {
      title: 'sent',
      list: sentFriends.data,
    },
  ];

  if (sentFriends.isLoading || recvFriends.isLoading) {
    return <Spinner />;
  }
  if (sentFriends.isError || recvFriends.isError) {
    return null;
  }

  return (
    <SectionList
      sections={requestedData}
      renderItem={(data, type) => (
        <RequestedFriendItem data={data} type={type} />
      )}
      keyExtractor={(data) => data.request_id}
    />
  );
}

interface RequestedFriendItemProps {
  data: RequestedFriend;
  type?: string;
}

function RequestedFriendItem({ data, type }: RequestedFriendItemProps) {
  const accept = useMutation({
    mutationFn: () => {
      return fetcher(`/friend/request/${data.request_id}/accept`, {
        method: 'POST',
      });
    },
  });
  const reject = useMutation({
    mutationFn: (type?: string) => {
      if (type === 'sent') {
        return fetcher(`/friend/request/${data.request_id}`, {
          method: 'DELETE',
        });
      }
      return fetcher(`/friend/request/${data.request_id}/reject`, {
        method: 'POST',
      });
    },
    onError: () => console.log('reject is failed'),
  });

  return (
    <div className="flex flex-row p-5">
      <p>{type === 'sent' ? data.receiver : data.requester}</p>
      {type === 'recv' ? (
        <button onClick={() => accept.mutate()}>V</button>
      ) : null}
      <button onClick={() => reject.mutate(type)} className="pl-3">
        X
      </button>
    </div>
  );
}

function FriendsList() {
  const { friends, isLoading, isError } = useFriends();

  if (isLoading) return <Spinner />;
  if (isError) return null;

  return (
    <SectionList
      sections={friends}
      renderItem={(friend) => <FriendItem friend={friend} />}
      keyExtractor={(friend) => friend.user_id}
    />
  );
}

function useOptionMenu() {
  const [open, setOpen] = useState(false);

  const data = useFloating({
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(3),
      flip(),
      shift({ padding: 3 }),
    ],
  });

  const context = data.context;

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'menu' });
  const interactions = useInteractions([click, dismiss, role]);

  return {
    open,
    setOpen,
    ...data,
    ...interactions,
  };
}

interface FriendItemProps {
  friend: Friend;
  onClickItem?(friend: Friend): void;
  onClickOption?(friend: Friend): void;
}

function FriendItem({ friend }: FriendItemProps) {
  const {
    open,
    setOpen,
    reference,
    floating,
    getReferenceProps,
    getFloatingProps,
    x,
    y,
    strategy,
  } = useOptionMenu();

  return (
    <div className="flex h-full w-full flex-row items-center justify-start px-5 py-4">
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
          <p className="min-w-0 truncate text-xs">{friend.status}</p>
        </div>
      </div>
      <button
        ref={reference}
        {...getReferenceProps()}
        className="ml-auto mt-2 flex h-full w-4 items-start text-lg hover:text-neutral-400"
      >
        :
      </button>
      <FloatingPortal>
        {open && (
          <div
            ref={floating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              width: 'max-content',
            }}
            {...getFloatingProps()}
          >
            <ul>
              <li className="bg-neutral-800 p-3 font-pixel text-xs text-white">
                <button onClick={() => setOpen(false)} className="w-full h-full">Invite Game</button>
              </li>
              <li className="bg-neutral-800 p-3 font-pixel text-xs text-white">
                <button className="w-full h-full">DM</button>
              </li>
              <li className="bg-neutral-800 p-3 font-pixel text-xs text-white">
                <button className="w-full h-full">Block</button>
              </li>
              <li className="bg-neutral-800 p-3 font-pixel text-xs text-red-700">
                <button className="w-full h-full">Delete</button>
              </li>
            </ul>
          </div>
        )}
      </FloatingPortal>
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
