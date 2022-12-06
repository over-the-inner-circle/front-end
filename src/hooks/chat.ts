import { useEffect, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useQuery, useMutation } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import { accessTokenState } from '@/states/user/auth';
import { RoomInfo, roomInfoState } from '@/states/roomInfoState';
import { useFetcher } from '@/hooks/fetcher';

export type RoomListType = 'all' | 'joined';

export function useRoomList(type: RoomListType) {
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
  });
  return result;
}

export function useJoinRoom() {
  const fetcher = useFetcher();
  const setRoomInfo = useSetRecoilState(roomInfoState);
  const mutation = useMutation({
    mutationFn: async (room: RoomInfo) => {
      return fetcher(`/chat/room/${room.room_id}/join`, {
        method: 'POST',
        body: JSON.stringify({ room_password: '' }),
      });
    },
    onSuccess: (data, variables) => {
      if (data.ok) {
        setRoomInfo(variables ?? null);
      }
    },
  });
  return mutation;
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
