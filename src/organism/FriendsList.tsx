import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { useQueryClient } from '@tanstack/react-query';
import { FloatingPortal } from '@floating-ui/react-dom-interactions';
import { profileUserState } from '@/states/user/profileUser';
import { useSocketRef } from '@/hooks/chat';
import { Friend, useDeleteFriend, useFriends } from '@/hooks/friends';
import { useOptionMenu } from '@/hooks/optionMenu';
import { useRequestNormalGame, useRequestWatchGame } from '@/hooks/game';
import Spinner from '@/atom/Spinner';
import SectionList from '@/molecule/SectionList';
import OptionMenu, { Option } from '@/molecule/OptionMenu';
import StatusIndicator from '@/molecule/StatusIndicator';
import { useSetCurrentDMOpponent } from '@/hooks/dm';

function useFriendsStatusSocket() {
  const socketRef = useSocketRef(`ws://${import.meta.env.VITE_BASE_URL}:9994`);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleNoti = (data: {
      user: string;
      state: 'online' | 'offline' | 'ingame';
    }) => {
      console.log(data);
      queryClient.setQueryData(['friend/all'], (prevFriends?: Friend[]) => {
        return prevFriends
          ? prevFriends.map((friend) =>
              friend.user_id === data.user
                ? { ...friend, state: data.state }
                : friend,
            )
          : undefined;
      });
    };

    const socket = socketRef.current;

    socket.on('update', handleNoti);

    return () => {
      socket.off('update', handleNoti);
    };
  }, [queryClient, socketRef]);
}

function FriendsList() {
  const { friends, isLoading, isError } = useFriends();
  useFriendsStatusSocket();

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
  const setProfileUser = useSetRecoilState(profileUserState);

  return (
    <div className="flex h-full w-full flex-row items-center justify-start p-3 px-5">
      <button
        className="min-w-fit"
        onClick={() => setProfileUser(friend.nickname)}
      >
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full">
          <img
            src={friend.prof_img}
            alt="profile"
            width={65}
            height={65}
            className="h-full w-full object-cover"
          />
        </div>
      </button>
      <div className="flex h-16 min-w-0 flex-col justify-around px-5">
        <p className="truncate text-base">{friend.nickname}</p>
        <div className="flex flex-row items-center space-x-2">
          <StatusIndicator status={friend.state} radius={8} />
          <p className="min-w-0 truncate text-xs">{friend.state}</p>
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
            <FriendOptionMenu friend={friend} close={() => setOpen(false)} />
          </div>
        )}
      </FloatingPortal>
    </div>
  );
}

interface FriendOptionMenuProps {
  friend: Friend;
  close(): void;
}

function FriendOptionMenu({ friend, close }: FriendOptionMenuProps) {
  const deleteFriend = useDeleteFriend();
  const requestWatchGame = useRequestWatchGame();
  const requestNormalGame = useRequestNormalGame();
  const setCurrentDMOpponent = useSetCurrentDMOpponent();

  const options: Option[] = [
    {
      label: 'Invite Game',
      onClick: () => {
        requestNormalGame(friend.nickname);
        close();
      },
    },
    {
      label: 'Watch Game',
      onClick: () => {
        requestWatchGame(friend.nickname);
        close();
      },
    },
    {
      label: 'DM',
      onClick: () => {
        setCurrentDMOpponent(friend.nickname);
        close();
      },
    },
    {
      label: 'Block',
      onClick: () => {
        close();
        /**/
      },
    },
    {
      label: 'Delete',
      color: 'text-red-700',
      onClick: () => {
        if (confirm('Are you sure?')) {
          deleteFriend.mutate(friend);
        }
        close();
      },
    },
  ];

  return <OptionMenu options={options} />;
}

export default FriendsList;
