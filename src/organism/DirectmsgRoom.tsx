import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAutoScroll, useSocketRef } from '@/hooks/chat';
import { fetcher } from '@/hooks/fetcher';
import { type Friend } from '@/hooks/friends';
import StatusIndicator from '@/molecule/StatusIndicator';

interface DirectmsgRoomProps {
  opponent: string;
  close(): void;
}

interface Message {
  sender: Friend;
  payload: string;
  created: Date;
}

interface SubscribeData {
  sender: Friend;
  payload: string;
}

function useDirectMessages(opponent: string) {
  const data = useQuery<Message[]>({
    queryKey: ['dm/messages', opponent],
    queryFn: async () => {
      const res = await fetcher(`/dm/${opponent}/messages`);

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

function useDirectMessage(opponent: string) {
  const queryClient = useQueryClient();
  const socketRef = useSocketRef(`ws://${import.meta.env.VITE_BASE_URL}:9992`);
  const { data: messages } = useDirectMessages(opponent);

  useEffect(() => {
    const socket = socketRef.current;

    const handleSub = (data: SubscribeData) => {
      queryClient.setQueryData<Message[]>(
        ['dm/messages', opponent],
        (prevMsg) => {
          const newMessage: Message = {
            sender: data.sender,
            payload: data.payload,
            created: new Date(),
          };
          return prevMsg ? [...prevMsg, newMessage] : [newMessage];
        },
      );
    };

    const handleAnnounce = (data: unknown) => {
      console.log(data);
    };

    socket.emit('join', { opponent });

    socket.on('subscribe', handleSub);
    socket.on('subscribe_self', handleSub);
    socket.on('announcement', handleAnnounce);

    return () => {
      socket.off('subscribe', handleSub);
      socket.off('subscribe_self', handleSub);
      socket.off('announcement', handleAnnounce);
    };
  }, [opponent, queryClient, socketRef]);

  return { messages, socket: socketRef.current };
}

function useOpponent(nickname: string) {
  const data = useQuery<Friend>({
    queryKey: ['user', nickname],
    queryFn: async () => {
      const res = await fetcher(`/user/${nickname}`);
      if (res.ok) return res.json();
      throw res;
    },
  });
  return data;
}

function DirectmsgRoom({ opponent, close }: DirectmsgRoomProps) {
  const [content, setContent] = useState('');
  const { messages, socket } = useDirectMessage(opponent);
  const { data: opponentInfo } = useOpponent(opponent);
  const autoScrollRef = useAutoScroll(messages);

  const sendMessage = () => {
    const msg = content.trim();
    if (msg) {
      socket.emit('publish', { opponent, payload: msg });
    }
    setContent('');
  };

  return (
    <>
      <div className="flex h-fit w-full items-center justify-between border-b border-inherit bg-neutral-800 p-2">
        {opponentInfo ? (
          <div className="flex flex-row p-2 gap-2">
            <div className="m-1 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
              <img
                src={opponentInfo.prof_img}
                alt="profile"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <p>{opponentInfo.nickname}</p>
              <div className="flex flex-row items-center space-x-2">
                <StatusIndicator status={opponentInfo.status} />
                <p className="min-w-0 truncate text-xs">
                  {opponentInfo.status ?? 'unknown'}
                </p>
              </div>
            </div>
              <button className='px-3'>:</button>
          </div>
        ) : (
          opponent
        )}
        <button onClick={close} className="px-1">
          ⬅
        </button>
      </div>
      <div
        ref={autoScrollRef}
        className="h-full w-full grow overflow-y-auto border-b border-inherit"
      >
        <ul className="flex h-fit w-full flex-col items-start justify-start">
          {messages?.map((message, idx) => (
            <li
              key={idx}
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

export default DirectmsgRoom;
