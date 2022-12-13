import { RoomInfo, roomInfoState, RoomUser } from '@/states/roomInfoState';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFetcher } from '@/hooks/fetcher';
import { toast } from 'react-toastify';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentUserInfoState } from '@/states/user/auth';

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

export function useInviteFriend(room_id: string) {
  const fetcher = useFetcher();
  const mutation = useMutation({
    mutationFn: (nickname: string) => {
      return fetcher(`/chat/room/${room_id}/invite`, {
        method: 'POST',
        body: JSON.stringify({ receiver_nickname: nickname }),
      });
    },
    onSuccess: (res, nickname) => {
      if (!res.ok) throw res;
      toast.success(`Invitation sent to ${nickname}`);
    },
    onError: () => {
      toast.error('Invitaion failed');
    },
  });

  return mutation;
}

export function useRestrictMember(room_id: string) {
  const fetcher = useFetcher();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      user,
      type,
      second = 60,
    }: {
      user: RoomUser;
      type: 'ban' | 'mute';
      second?: number;
    }) => {
      return fetcher(`/chat/room/${room_id}/${type}`, {
        method: 'POST',
        body: JSON.stringify({
          user_id: user.user_id,
          time_amount_in_seconds: second,
        }),
      });
    },
    onSuccess: (res, { user, type }) => {
      if (!res.ok) throw res;
      queryClient.invalidateQueries({ queryKey: ['chat/room', 'member'] });
      toast.success(`${type} ${user.nickname} success`);
    },
    onError: (_error, { type }) => {
      toast.error(`${type} failed`);
    },
  });

  return mutation;
}

export function useKickMember(room_id: string) {
  const fetcher = useFetcher();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (user: RoomUser) => {
      return fetcher(`/chat/room/${room_id}/kick`, {
        method: 'POST',
        body: JSON.stringify({ user_id: user.user_id }),
      });
    },
    onSuccess: (res, user) => {
      if (!res.ok) throw res;
      queryClient.invalidateQueries({ queryKey: ['chat/rooms', 'member'] });
      toast.success(`Kicked ${user.nickname}`);
    },
    onError: () => {
      toast.error('Kick failed');
    },
  });

  return mutation;
}

export function useChageRole(room_id: string) {
  const fetcher = useFetcher();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      user,
      role,
    }: {
      user: RoomUser;
      role: 'admin' | 'user';
    }) => {
      return fetcher(`/chat/room/${room_id}/role`, {
        method: 'PUT',
        body: JSON.stringify({ user_id: user.user_id, role }),
      });
    },
    onSuccess: (res, { user, role }) => {
      if (!res.ok) throw res;
      queryClient.invalidateQueries({ queryKey: ['chat/room', 'member'] });
      toast.success(`${user.nickname} is ${role}`);
    },
    onError: (_error, { user }) => {
      toast.error(`Change role failed ${user.nickname}`);
    },
  });

  return mutation;
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
