import { useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { fetcher } from '@/hooks/fetcher';
import { useQuery, useMutation } from '@tanstack/react-query';
import { RoomInfo, roomInfoState } from '@/states/roomInfoState';
import SideBarLayout from '@/molecule/SideBarLayout';
import SectionList from '@/molecule/SectionList';
import ChatingRoom from '@/organism/ChatingRoom';
import CreateChatForm from '@/organism/CreateChatForm';

export type RoomListType = 'all' | 'joined';

function useRoomList(type: RoomListType) {
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

const Chat = () => {
  const [roomInfo, setRoomInfo] = useRecoilState(roomInfoState); //room_id need to be null when user is not in any room

  return (
    <SideBarLayout>
      {roomInfo ? (
        <ChatingRoom roomInfo={roomInfo} close={() => setRoomInfo(null)} />
      ) : (
        <ChattingRoomList />
      )}
    </SideBarLayout>
  );
};

function useJoinRoom() {
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

function ChattingRoomList() {
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [roomListFilter, setRoomListFilter] = useState<RoomListType>('joined');

  const joinRoom = useJoinRoom();
  const setRoomInfo = useSetRecoilState(roomInfoState);
  const handleClick = (room: RoomInfo) => {
    if (roomListFilter == 'joined') {
      setRoomInfo(room);
    } else {
      joinRoom.mutate(room);
    }
  };

  const { data: roomList } = useRoomList(roomListFilter);

  const section = [
    {
      title: roomListFilter,
      list: roomList ?? [],
    },
  ];

  return (
    <>
      <div
        className="flex h-12 w-full shrink-0 flex-row items-center justify-between
                       border-b border-neutral-400 bg-neutral-800 px-5"
      >
        <button
          className="flex flex-row items-center justify-start"
          onClick={() => setIsOpenForm(!isOpenForm)}
        >
          <p className="text-lg">Chat</p>
          <p className="px-1">{isOpenForm ? 'x' : '+'}</p>
        </button>
        <button
          className="text-xs"
          onClick={() =>
            setRoomListFilter(roomListFilter === 'all' ? 'joined' : 'all')
          }
        >
          All/Joined
        </button>
      </div>
      {isOpenForm ? <CreateChatForm /> : null}
      <SectionList
        sections={section}
        renderItem={(room) => (
          <button onClick={() => handleClick(room)}>{room.room_name}</button>
        )}
        keyExtractor={(room) => room.room_id}
      />
    </>
  );
}

export default Chat;
