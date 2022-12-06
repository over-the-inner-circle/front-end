import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetcher } from '@/hooks/fetcher';
import {RoomInfo} from "@/states/roomInfoState";
import { useAutoScroll, useSocketRef } from '@/hooks/chat';
import * as process from "process";

export type ChattingSideBarState = 'chatting' | 'configChattingRoom';

export interface ChatProps {
  roomInfo: RoomInfo;
  close(): void;
}

export interface ChattingSideBarProps {
  sidebarState: ChattingSideBarState;
  roomInfo: RoomInfo;
  close(): void;
  closeSidebarState(): void;
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

export default function ChatingRoom({ roomInfo, close }: ChatProps) {
  const [sidebarState, setSidebarState] = useState<ChattingSideBarState> (
    'chatting');
  return (
    <ChattingSideBarSelector sidebarState={sidebarState} roomInfo={roomInfo} close={close} closeSidebarState={() => {setSidebarState('chatting')}} />
  );
}

function ChattingSideBarSelector ( { sidebarState, roomInfo, close, closeSidebarState }: ChattingSideBarProps) {
  switch (sidebarState) {
    case 'chatting':
      return <ChattingSideBar sidebarState= {sidebarState} roomInfo={roomInfo} close={close} closeSidebarState={closeSidebarState} />;
    case 'configChattingRoom':
      return <ConfigChattingRoomSideBar sidebarState= {sidebarState} roomInfo={roomInfo} close={close} closeSidebarState={closeSidebarState}/>;
  }
}

function useChatMessages(roomId: string) {
  const data = useQuery<Message[]>({
    queryKey: ['chat/room/messages', roomId],
    queryFn: async () => {
      const res = await fetcher(`/chat/room/${roomId}/messages`);

      if (res.ok) {
        const data = await res.json();
        return data.messages;
      }
      return [];
    },
    refetchOnWindowFocus: false,
  });

  return data;
}

function useChat(roomId: string) {
  const queryClient = useQueryClient();
  const socketRef = useSocketRef(`ws://${import.meta.env.VITE_BASE_URL}:9999`);
  const { data: messages } = useChatMessages(roomId);

  useEffect(() => {
    const socket = socketRef.current;

    const handleSub = (data: SubscribeData) => {
      queryClient.setQueryData<Message[]>(
        ['chat/room/messages', roomId],
        (prevMsg) => {
          const newMessage: Message = {
            room_msg_id:
              prevMsg && prevMsg.length
                ? prevMsg[prevMsg.length - 1].room_msg_id + 1
                : 1,
            room_id: roomId,
            sender: data.sender,
            payload: data.payload,
            created: new Date(),
          };
          return prevMsg ? [...prevMsg, newMessage] : [newMessage];
        },
      );
    };

    const handleAnnounce = (data) => {
      console.log(data);
    };

    socket.emit('join', { room: roomId });

    socket.on('subscribe', handleSub);
    socket.on('subscribe_self', handleSub);
    socket.on('announcement', handleAnnounce);

    return () => {
      socket.off('subscribe', handleSub);
      socket.off('subscribe_self', handleSub);
      socket.off('announcement', handleAnnounce);
    };
  }, [roomId, queryClient, socketRef]);

  return { messages, socket: socketRef.current };
}

function ChattingSideBar({sidebarState, roomInfo, close, closeSidebarState }: ChattingSideBarProps) {
  const [content, setContent] = useState('');
  const { messages, socket } = useChat(roomInfo.room_id);
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
          ⬅
        </button>
        {roomInfo.room_name}
        <button onClick={() => closeSidebarState()} className="px-1 text-2xl align-middle">
          ⚙
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

function ConfigChattingRoomSideBar({sidebarState, roomInfo, close, closeSidebarState}: ChattingSideBarProps) {

  return (
    <>
      <div className="flex h-fit w-full items-center justify-between border-b border-inherit bg-neutral-800 p-2">
        {roomInfo.room_name}
      </div>
      <div className="h-full w-full grow overflow-y-auto border-b border-inherit">
        <ul className="flex h-fit w-full flex-col items-start justify-start">
          <li className="flex h-fit w-full items-center justify-between border-b border-inherit bg-neutral-800 p-2">
            <button> UserList </button>
          </li>
          <li className="flex h-fit w-full items-center justify-between border-b border-inherit bg-neutral-800 p-2">
            <button> ConfigChattingRoom </button>
          </li>
        </ul>
      </div>
    </>
  )
}

function userListItem(roomInfo: RoomInfo) {
  const result = useQuery({
    queryKey: ['chat/room', roomInfo.room_id],
    queryFn: async ():promise< => {
      const res = await fetcher(`/chat/room/${roomInfo.room_id}`);

      if (res.ok) {
        const data = await res.json();
        return data.room;
      }
      return null;
    }
  })

}



function showUserList( {sidebarState, roomInfo, close, closeSidebarState}: ChattingSideBarProps ) {



  return (
    <>
      <div className="flex h-fit w-full items-center justify-between border-b border-inherit bg-neutral-800 p-2">
        {roomInfo.room_name}
      </div>
      <div className="h-full w-full grow overflow-y-auto border-b border-inherit">
        <ul className="flex h-fit w-full flex-col items-start justify-start">
          <li className="flex h-fit w-full items-center justify-between border-b border-inherit bg-neutral-800 p-2">

          </li>
        </ul>
      </div>
    </>
  )
}

