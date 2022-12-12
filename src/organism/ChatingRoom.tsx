import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useFetcher } from '@/hooks/fetcher';
import { useRecoilValue } from 'recoil';
import { currentUserInfoState } from '@/states/user/auth';
import { RoomInfo, RoomUserList } from '@/states/roomInfoState';
import { useAutoScroll, useChat } from '@/hooks/chat';
import {
  useDeleteRoom,
  useEditRoomAccess,
  useEditRoomPassword,
  useExitRoom,
} from '@/hooks/mutation/chat';
import Spinner from '@/atom/Spinner';
import Button from '@/atom/Button';
import { FloatingPortal } from '@floating-ui/react-dom-interactions';
import { useChatMessages } from '@/hooks/query/chat';
import {useOptionMenu} from "@/hooks/optionMenu";
import {useRequestNormalGame} from "@/hooks/game";

export type ChattingSideBarState = 'chat' | 'menu' | 'userList';

export interface ChattingSideBarProps {
  roomInfo: RoomInfo;
  close(): void;
  setSidebarState(sidebarState: ChattingSideBarState): void;
}

interface UserInfo {
  user_id: string;
  nickname: string;
  provider: string;
  third_party_id: string;
  two_factor_authentication_key: string;
  two_factor_authentication_type: string;
  prof_img: string;
  mmr: number;
  created: Date;
  deleted: Date;
}

interface SubscribeData {
  sender: UserInfo;
  payload: string;
}

interface Message {
  room_msg_id: number;
  room_id: string;
  sender: UserInfo;
  payload: string;
  created: Date;
}

function useGetUserListItem(roomInfo: RoomInfo) {
  const fetcher = useFetcher();
  const result = useQuery({
    queryKey: ['chat/room', roomInfo.room_id],
    queryFn: async (): Promise<RoomUserList[]> => {
      const res = await fetcher(`/chat/room/${roomInfo.room_id}/members`);

      if (res.ok) {
        const data = await res.json();
        return data.members;
      }
      return [];
    },
  });
  return result;
}

interface ShowUserListProps {
  roomInfo: RoomInfo;
  close(): void;
}

interface ShowUserListInfo {
  roomInfo: RoomInfo;
  user: RoomUserList;
  close?(): void;
}

export interface UserListOption {
  label: string;
  onClick(): void;
}

function UserListOptionView({ options }: { options: UserListOption[] }) {
  return (
    <ul>
      {options.map((option) => (
        <li
          key={option.label}
          className="bg-neutral-800 p-3 font-pixel text-xs text-white"
        >
          <button
            onClick={option.onClick}
            className={`h-full w-full ''}`}
          >{option.label}
          </button>
        </li>
      ))}
    </ul>
  )
}

function UserOptionMenu({roomInfo, user}: ShowUserListInfo) {
  const requestNormalGame = useRequestNormalGame();

  const options: UserListOption[] = [
    {
      label: 'Invite Game',
      onClick: () => {
        requestNormalGame(user.nickname);
      }
    },
  ];

  return <UserListOptionView options={options} />;
}

function ShowUserList({ roomInfo }: ShowUserListProps) {
  const { data: users, isError, isLoading } = useGetUserListItem(roomInfo);

  if (isLoading || isError) return <Spinner />;

  return (
    <>
      <div className="flex h-fit w-full items-center justify-between border-b border-inherit bg-neutral-800 p-2">
        {roomInfo.room_name}
      </div>
      <div className="h-full w-full grow overflow-y-auto border-b border-inherit">
        <ul className="flex h-fit w-full flex-col items-start justify-start">
          {users.map((user) => (
            <li
              key={user.user_id}
              className="h-fit w-full break-words p-1 px-5 text-xs"
            >
              <ShowUserItem roomInfo={roomInfo} user={user} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function ShowUserItem({ roomInfo, user }: ShowUserListInfo) {
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
    <>
      <button
        ref={reference}
        {...getReferenceProps()}
      >
        {`${user.nickname}`}
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
            <UserOptionMenu roomInfo={roomInfo} user={user} close={() => setOpen(false)} />
          </div>
        )}
      </FloatingPortal>
    </>
  );
}

function ChattingRoom({
  roomInfo,
  close,
  setSidebarState,
}: ChattingSideBarProps) {
  const [content, setContent] = useState('');
  const { socket } = useChat(roomInfo.room_id);
  const { data: messages } = useChatMessages(roomInfo.room_id);
  const autoScrollRef = useAutoScroll(messages);

  const sendMessage = () => {
    const msg = content.trim();
    if (msg) {
      socket.emit('publish', { room: roomInfo.room_id, payload: msg });
    }
    setContent('');
  };

  return (
    <>
      <div className="flex h-fit w-full items-center justify-between border-b border-inherit bg-neutral-800 p-3">
        <button onClick={close} className="px-1">
          &lt;
        </button>
        {roomInfo.room_name}
        <button onClick={() => setSidebarState('menu')} className="px-1">
          :
        </button>
      </div>
      <div
        ref={autoScrollRef}
        className="h-full w-full grow overflow-y-auto border-b border-inherit"
      >
        <ul className="flex h-fit w-full flex-col items-start justify-start">
          {messages?.map((message) => (
            <li
              key={message.room_msg_id}
              className="h-fit w-full break-words p-1 px-5 text-xs"
            >{`${message.sender.nickname}: ${message.payload}`}</li>
          ))}
        </ul>
      </div>
      <div className="h-30 flex">
        <textarea
          placeholder="plase input here."
          className="h-20 w-full resize-none border-none bg-neutral-300 text-black"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
        />
        <button
          className="h-full border-b border-inherit bg-neutral-800 px-3"
          onClick={() => {
            sendMessage();
          }}
        >
          send
        </button>
      </div>
    </>
  );
}

function ChattingRoomMenu({
  roomInfo,
  close,
  setSidebarState,
}: ChattingSideBarProps) {
  const currentUserInfo = useRecoilValue(currentUserInfoState);

  const exitRoom = useExitRoom();
  const deleteRoom = useDeleteRoom();
  const menuList = {
    userList: {
      title: 'User List',
      onClick: () => setSidebarState('userList'),
    },
    exit: {
      title: 'Exit',
      className: 'text-red-500',
      onClick: () => {
        if (confirm('Are you sure?')) {
          exitRoom.mutate(roomInfo.room_id);
        }
      },
    },
    delete: {
      title: 'Delete',
      className: 'text-red-500',
      onClick: () => {
        if (confirm('Are you sure?')) {
          deleteRoom.mutate(roomInfo.room_id);
        }
      },
    },
  };

  return (
    <>
      <div
        className="flex h-fit w-full items-center justify-between
                      border-b border-neutral-400 bg-neutral-800 p-3"
      >
        <button onClick={close} className="px-1">
          &lt;
        </button>
        {roomInfo.room_name}
        <p className="h-full w-6 px-1" />
      </div>
      <div className="h-full w-full grow overflow-y-auto border-b border-neutral-400">
        <ul className="flex h-fit w-full flex-col items-start justify-start">
          {currentUserInfo?.user_id === roomInfo.room_owner_id ? (
            <li className="w-full">
              <EditRoomInfoForm roomInfo={roomInfo} />
            </li>
          ) : null}
          <li
            className="flex h-fit w-full items-center justify-between
                        border-b border-neutral-400 bg-neutral-700 p-2 px-5"
          >
            <button onClick={menuList['userList'].onClick}>
              {menuList['userList'].title}
            </button>
          </li>
          {currentUserInfo?.user_id === roomInfo.room_owner_id ? (
            <li
              className="flex h-fit w-full items-center justify-between
                           border-b border-neutral-400 bg-neutral-700 p-2 px-5
                           text-red-500"
            >
              <button onClick={menuList['delete'].onClick}>
                {menuList['delete'].title}
              </button>
            </li>
          ) : (
            <li
              className="flex h-fit w-full items-center justify-between
                         border-b border-neutral-400 bg-neutral-700 p-2 px-5
                         text-red-500"
            >
              <button onClick={menuList['exit'].onClick}>
                {menuList['exit'].title}
              </button>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}

function EditRoomInfoForm({ roomInfo }: { roomInfo: RoomInfo }) {
  const [password, setPassword] = useState('');
  const [accessType, setAccessType] = useState<RoomInfo['room_access']>(
    roomInfo.room_access,
  );

  useEffect(() => {
    if (accessType !== 'protected') {
      setPassword('');
    }
  }, [accessType]);

  const editRoomAccess = useEditRoomAccess(roomInfo.room_id);
  const editRoomPassword = useEditRoomPassword(roomInfo.room_id);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    editRoomPassword.mutate(password);
    if (roomInfo.room_access !== accessType) {
      editRoomAccess.mutate(accessType);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col items-center justify-start gap-2
                 border-b border-neutral-400 bg-neutral-800 p-2"
    >
      <div className="flex w-full flex-row items-center justify-start p-1">
        <label htmlFor="room_access">type:</label>
        <select
          name="room_access"
          className="ml-2 w-full bg-neutral-500 p-1"
          value={accessType}
          onChange={(e) =>
            setAccessType(e.target.value as RoomInfo['room_access'])
          }
        >
          <option value="public">Public</option>
          <option value="protected">Protected</option>
          <option value="private">Private</option>
        </select>
      </div>
      <div className="flex w-full flex-row items-center justify-start p-1">
        <label
          htmlFor="room_password"
          className={`${accessType !== 'protected' ? 'opacity-30' : ''}`}
        >
          password:
        </label>
        <input
          className="ml-2 w-full border-b-4 border-white bg-inherit disabled:opacity-30"
          name="room_password"
          type="password"
          disabled={accessType !== 'protected'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button type="submit" className="h-fit w-full bg-red-500">
        Edit
      </Button>
    </form>
  );
}

export interface ChatProps {
  roomInfo: RoomInfo;
  close(): void;
}

export default function ChattingRoomWrapper({ roomInfo, close }: ChatProps) {
  const [sidebarState, setSidebarState] =
    useState<ChattingSideBarState>('chat');

  switch (sidebarState) {
    case 'menu':
      return (
        <ChattingRoomMenu
          roomInfo={roomInfo}
          close={() => setSidebarState('chat')}
          setSidebarState={setSidebarState}
        />
      );
    case 'userList':
      return (
        <ShowUserList
          roomInfo={roomInfo}
          close={() => setSidebarState('chat')}
        />
      );
    default:
      return (
        <ChattingRoom
          roomInfo={roomInfo}
          close={close}
          setSidebarState={setSidebarState}
        />
      );
  }
}
