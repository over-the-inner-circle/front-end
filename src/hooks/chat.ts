import { useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import { accessTokenState } from '@/states/user/auth';
import { RoomInfo, roomInfoState } from '@/states/roomInfoState';
import { Friend } from '@/hooks/friends';
import { useFetcher } from '@/hooks/fetcher';
import {
  useDismiss,
  useFloating,
  useInteractions,
} from '@floating-ui/react-dom-interactions';
import { toast } from 'react-toastify';

export type RoomListType = 'all' | 'joined';

interface SubscribeData {
  sender: Friend;
  payload: string;
}

interface Message {
  room_msg_id: number;
  room_id: string;
  sender: Friend;
  payload: string;
  created: Date;
}

export function useChatMessages(roomId: string) {
  const fetcher = useFetcher();
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

export function useChat(roomId: string) {
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

    const handleAnnounce = (data: { payload: string }) => {
      toast.info(data.payload);
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

export function useRoomList(type: RoomListType) {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();
  const result = useQuery({
    queryKey: ['chat/rooms', type],
    queryFn: async (): Promise<RoomInfo[]> => {
      const res = await fetcher(`/chat/rooms/${type}`);
      if (res.ok) {
        const data = await res.json();
        return data.rooms;
      }
      return [];
    },
    select: (roomList) => {
      if (type === 'all') {
        const joinedRoomList = queryClient.getQueryData<RoomInfo[]>([
          'chat/rooms',
          'joined',
        ]);

        if (joinedRoomList) {
          return roomList.filter(
            (all) =>
              !joinedRoomList.find((joined) => joined.room_id === all.room_id),
          );
        }
      }
      return roomList;
    },
  });
  return result;
}

export function useJoinRoom() {
  const fetcher = useFetcher();
  const setRoomInfo = useSetRecoilState(roomInfoState);
  const mutation = useMutation({
    mutationFn: async ({
      room,
      password = '',
    }: {
      room: RoomInfo;
      password?: string;
    }) => {
      return fetcher(`/chat/room/${room.room_id}/join`, {
        method: 'POST',
        body: JSON.stringify({ room_password: password }),
      });
    },
    onSuccess: (data, info) => {
      if (data.ok) {
        setRoomInfo(info.room ?? null);
      } else {
        throw data;
      }
    },
    onError: () => {
      toast.error('Fail to join this room');
    },
  });
  return mutation;
}

export function usePasswordForm() {
  const [open, setOpen] = useState(false);
  const { floating, context } = useFloating({
    open,
    onOpenChange: setOpen,
  });

  const dismiss = useDismiss(context);
  const { getFloatingProps } = useInteractions([dismiss]);

  return { open, setOpen, floating, context, getFloatingProps };
}

export function useSocketRef(url: string) {
  const access_token = useRecoilValue(accessTokenState);
  const socketRef = useRef(
    io(url, {
      auth: { access_token },
      autoConnect: false,
    }),
  );

  useEffect(() => {
    const socket = socketRef.current;

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (access_token) {
      socket.auth = { access_token };
      socket.connect();
    }
  }, [access_token]);

  return socketRef;
}

export function useAutoScroll(dependency: unknown) {
  const autoScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scrollElement = autoScrollRef.current;
    if (scrollElement) {
      // FIX: 맨 아래를 보고 있을 때만 동작하게 하기
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [dependency]);

  return autoScrollRef;
}
