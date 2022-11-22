import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetcher } from '@/hooks/fetcher';

export interface ChatProps {
  roomId: string;
  setRoom_Id: (room_id: string | null) => void;
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
  sender_id: string;
  payload: string;
  created: Date;
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
    retry: false,
    staleTime: Infinity,
  });

  return data;
}

function useSocketRef(url: string) {
  const access_token = window.localStorage.getItem('access_token');
  const socketRef = useRef(
    io(url, {
      auth: { access_token },
      autoConnect: false,
    }),
  );

  useEffect(() => {
    const socket = socketRef.current;

    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef;
}

function useChat(roomId: string) {
  const { data: messages } = useChatMessages(roomId);
  const queryClient = useQueryClient();
  const socketRef = useSocketRef(`ws://${import.meta.env.VITE_BASE_URL}:9999`);

  useEffect(() => {
    const socket = socketRef.current;

    const handleSub = (data: SubscribeData) => {
      queryClient.setQueryData<Message[]>(
        ['chat/room/messages', roomId],
        (prevMsg) => {
          const newMessage: Message = {
            room_msg_id: prevMsg ? prevMsg.length + 1 : 1,
            room_id: roomId,
            sender_id: data.sender?.nickname,
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

export default function ChatingRoom({ roomId, setRoom_Id }: ChatProps) {
  const [content, setContent] = useState('');
  const { messages, socket } = useChat(roomId);

  return (
    <div
      className="flex h-full w-full flex-col
										items-start justify-start border-l border-neutral-400 bg-neutral-600 font-pixel
										text-sm text-white"
    >
      <div className="flex h-10 w-full items-center justify-between border-b border-inherit bg-neutral-800 px-3">
        {roomId}
        <button onClick={() => setRoom_Id(null)} className="px-1">
          ⬅
        </button>
      </div>
      <div className="flex h-full w-full flex-col items-start justify-end border-b border-inherit">
        <div className="flex h-full w-full flex-col items-start justify-end border-b border-inherit">
          {messages?.map((message) => (
            <li
              key={message.room_msg_id}
            >{`${message.sender_id}: ${message.payload}`}</li>
          ))}
        </div>
        <div className="h-30 flex items-end justify-end">
          <textarea
            placeholder="plase input here."
            className="h-20 w-full resize-none border-none bg-neutral-300 text-black"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            className="h-full border-b border-inherit bg-neutral-800 px-3"
            onClick={() => {
              socket.emit('publish', { room: roomId, payload: content });
              setContent('');
            }}
          >
            send
          </button>
        </div>
      </div>
    </div>
  );
}
