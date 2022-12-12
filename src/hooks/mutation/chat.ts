import { RoomInfo, roomInfoState } from "@/states/roomInfoState";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFetcher } from "@/hooks/fetcher";
import { toast } from "react-toastify";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { currentUserInfoState } from "@/states/user/auth";


export function useAddChatRoom(
  name: string,
  accessType: RoomInfo['room_access'],
  password: string,
) {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();
  const setRoomInfo = useSetRecoilState(roomInfoState);
  const currentUserInfo = useRecoilValue(currentUserInfoState);

  const addChatRoom = useMutation({
    mutationFn: (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      return fetcher('/chat/room', {
        method: 'POST',
        body: JSON.stringify({
          room_name: name,
          room_access: accessType,
          room_password: password,
        }),
      });
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['chat/rooms'] });
      try {
        const { room_id } = await data.json();
        setRoomInfo({
          room_id,
          room_name: name,
          room_access: accessType,
          room_owner_id: currentUserInfo?.user_id ?? '',
          created: new Date(),
        });
      } catch (error) {
        return error;
      }
    },
  });

  return addChatRoom;
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

export function useExitRoom() {
  const fetcher = useFetcher();
  const setRoomInfo = useSetRecoilState(roomInfoState);
  const mutation = useMutation({
    mutationFn: async (room_id: string) => {
      return fetcher(`/chat/room/${room_id}/exit`, {
        method: 'POST',
      });
    },
    onSuccess: (data) => {
      if (data.ok) {
        setRoomInfo(null);
      } else {
        throw data;
      }
    },
    onError: () => {
      toast.error('Fail to exit this room');
    },
  });
  return mutation;
}

export function useDeleteRoom() {
  const fetcher = useFetcher();
  const setRoomInfo = useSetRecoilState(roomInfoState);
  const mutation = useMutation({
    mutationFn: async (room_id: string) => {
      return fetcher(`/chat/room/${room_id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: (data) => {
      if (data.ok) {
        setRoomInfo(null);
      } else {
        throw data;
      }
    },
    onError: () => {
      toast.error('Fail to delete this room');
    },
  });
  return mutation;
}

export function useEditRoomAccess(room_id: string) {
  const fetcher = useFetcher();
  const [roomInfo, setRoomInfo] = useRecoilState(roomInfoState);
  const mutation = useMutation({
    mutationFn: (room_access: RoomInfo['room_access']) => {
      return fetcher(`/chat/room/${room_id}/access`, {
        method: 'PUT',
        body: JSON.stringify({ room_access }),
      });
    },
    onSuccess: (res, room_access) => {
      if (!res.ok) throw res;
      setRoomInfo((currRoomInfo) =>
        currRoomInfo
          ? ({
              ...roomInfo,
              room_access,
            } as RoomInfo)
          : currRoomInfo,
      );
      toast.success('success');
    },
    onError: () => {
      toast.error('failed');
    },
  });
  return mutation;
}

export function useEditRoomPassword(room_id: string) {
  const fetcher = useFetcher();
  const [roomInfo, setRoomInfo] = useRecoilState(roomInfoState);
  const mutation = useMutation({
    mutationFn: (room_password: string) => {
      return fetcher(`/chat/room/${room_id}/password`, {
        method: 'PUT',
        body: JSON.stringify({ room_password }),
      });
    },
    onSuccess: (res, room_password) => {
      if (!res.ok) throw res;
      setRoomInfo((currRoomInfo) =>
        currRoomInfo
          ? ({
              ...roomInfo,
              room_password,
            } as RoomInfo)
          : currRoomInfo,
      );
      toast.success('success');
    },
    onError: () => {
      toast.error('failed');
    },
  });
  return mutation;
}
