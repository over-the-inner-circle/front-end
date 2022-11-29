import { useState } from 'react';
import { useRecoilState } from 'recoil';
import ChatingRoom from '@/organism/ChatingRoom';
import { fetcher } from '@/hooks/fetcher';
import SideBarLayout from '@/molecule/SideBarLayout';
import { useQuery, useMutation } from '@tanstack/react-query';
import SectionList from '@/molecule/SectionList';
import CreateChatForm from './CreateChatForm';
import { RoomInfo, roomInfoState } from '@/states/roomInfoState';

function useRoomList(type: 'all' | 'joined') {
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
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [roomInfo, setRoomInfo] = useRecoilState(roomInfoState); //room_id need to be null when user is not in any room
  const { data: allRooms } = useRoomList('all');
  const { data: joinedRooms } = useRoomList('joined');

  const section = [
    {
      title: 'all',
      list: allRooms ?? [],
    },
    {
      title: 'joined',
      list: joinedRooms ?? [],
    },
  ];
  const mutation = useMutation({
    mutationFn: async (room: RoomInfo) => {
      return fetcher(`/chat/room/${room.room_id}/join`, {
        method: 'POST',
        body: JSON.stringify({ room_password: '' }),
      });
    },
    onSettled: (_data, _error, variables) => {
      setRoomInfo(variables ?? null);
    },
  });

  return (
    <SideBarLayout>
      {roomInfo ? (
        <ChatingRoom roomInfo={roomInfo} close={() => setRoomInfo(null)} />
      ) : (
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
            <button className="text-xs">All/Joined</button>
          </div>
          {isOpenForm ? <CreateChatForm /> : null}
          <SectionList
            sections={section}
            renderItem={(room) => (
              <button onClick={() => mutation.mutate(room)}>
                {room.room_name}
              </button>
            )}
            keyExtractor={(room) => room.room_id}
          />
        </>
      )}
    </SideBarLayout>
  );
};

export default Chat;
