import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { dmHistoryState, type DmInfo } from '@/states/dmHistoryState';
import { useSocketRef } from "./chat";
import { fetcher } from "./fetcher";
import { type Friend } from "./friends";

interface Message {
  sender: Friend;
  payload: string;
  created: Date;
}

interface SubscribeData {
  sender: Friend;
  payload: string;
}

export function useDirectMessages(opponent: string) {
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

export function useDirectMessageSocket(opponent: string) {
  const queryClient = useQueryClient();
  const socketRef = useSocketRef(`ws://${import.meta.env.VITE_BASE_URL}:9992`);
  const setDmHistory = useSetRecoilState(dmHistoryState);

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
      setDmHistory((currHistory) =>
        currHistory.map((dmInfo) => {
          if (dmInfo.opponent.nickname === opponent) {
            return { ...dmInfo, last_dm: new Date(), last_read: new Date() };
          }
          return dmInfo;
        }),
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
  }, [opponent, queryClient, socketRef, setDmHistory]);

  return { socket: socketRef.current };
}

export function useUpdateDmHistory(opponent: Friend | undefined) {
  const setDmHistory = useSetRecoilState(dmHistoryState);

  useEffect(() => {
    if (opponent) {
      setDmHistory((currHistory) => {
        const newHistory: DmInfo = {
          opponent: opponent,
          last_read: new Date(),
          last_dm: new Date(),
        };
        const idx = currHistory.findIndex(
          (dmInfo) => dmInfo.opponent.user_id === opponent.user_id,
        );
        return idx !== -1
          ? [
              ...currHistory.slice(0, idx),
              newHistory,
              ...currHistory.slice(idx + 1),
            ]
          : [...currHistory, newHistory];
      });
    }
  }, [opponent, setDmHistory]);
}
