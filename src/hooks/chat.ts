import { useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import { accessTokenState } from '@/states/user/auth';
import { RoomInfo, roomInfoState } from '@/states/roomInfoState';
import { useFetcher } from '@/hooks/fetcher';
import {
  useDismiss,
  useFloating,
  useInteractions,
} from '@floating-ui/react-dom-interactions';
import { toast } from 'react-toastify';

export type RoomListType = 'all' | 'joined';

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
