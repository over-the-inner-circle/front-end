import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

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
  nickname: string;
  content: string;
}

function useChat(roomId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const access_token = window.localStorage.getItem('access_token');
  const socketRef = useRef(
    io(`ws://${import.meta.env.VITE_BASE_URL}:9999`, {
      auth: { access_token },
      autoConnect: false,
    }),
  );

  useEffect(() => {
    const socket = socketRef.current;

    const handleSub = (data: SubscribeData) => {
      setMessages((msg) => [
        ...msg,
        { nickname: data.sender?.nickname, content: data.payload },
      ]);
    };

    const handleAnnounce = (data) => {
      console.log(data);
    };

    socket.connect();
    socket.emit('join', { room: roomId });

    socket.on('subscribe', handleSub);
    socket.on('subscribe_self', handleSub);
    socket.on('announcement', handleAnnounce);

    return () => {
      socket.off('subscribe', handleSub);
      socket.off('subscribe_self', handleSub);
      socket.off('announcement', handleAnnounce);
      socket.disconnect();
    };
  }, [roomId]);

  return { messages, socket: socketRef.current };
}

export default function ChatingRoom({ roomId, setRoom_Id }: ChatProps) {
  const [content, setContent] = useState('');
  const { messages, socket } = useChat(roomId);
  const sendMessage = () => {
    socket.emit('publish', { room: roomId, payload: content });
    setContent('');
  }


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
          {messages.map((message, idx) => (
            <li key={idx}>{`${message.nickname}: ${message.content}`}</li>
          ))}
        </div>
        <div className="h-30 flex items-end justify-end">
          <textarea
            placeholder="plase input here."
            className="h-20 w-full resize-none border-none bg-neutral-300 text-black"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }
            }
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
      </div>
    </div>
  );
}
