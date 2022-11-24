import { Link } from 'react-router-dom';
import { Friend, useDeleteFriend, useFriends } from '@/hooks/friends';
import Circle from '@/atom/Circle';
import Spinner from '@/atom/Spinner';
import SectionList from '@/molecule/SectionList';
import { FloatingPortal } from '@floating-ui/react-dom-interactions';
import { useOptionMenu } from '@/hooks/optionMenu';

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
            className={
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
            <OptionsMenu friend={friend} onClick={() => setOpen(false)} />
          </div>
        )}
      </FloatingPortal>
    </div>
  );
}

interface OptionMenu {
  friend: Friend;
  onClick(): void;
}

function OptionsMenu({ friend, onClick }: OptionMenu) {
  const deleteFriend = useDeleteFriend();
  const options = [
    {
      label: 'Invite Game',
      onClick: () => {
        /**/
      },
    },
    {
      label: 'DM',
      onClick: () => {
        /**/
      },
    },
    {
      label: 'Block',
      onClick: () => {
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
      },
    },
  ];
  return (
    <ul>
      {options.map((option) => (
        <li
          key={option.label}
          className="bg-neutral-800 p-3 font-pixel text-xs text-white"
        >
          <button
            onClick={() => {
              option.onClick();
              onClick();
            }}
            className={`h-full w-full ${option.color ?? ''}`}
          >
            {option.label}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default FriendsList;
