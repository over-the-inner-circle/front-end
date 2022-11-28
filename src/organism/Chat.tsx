import { useState } from 'react';
import ChatingRoom from '@/organism/ChatingRoom';
import { fetcher } from '@/hooks/fetcher';
import SideBarLayout from '@/molecule/SideBarLayout';
import { useQuery, useMutation } from '@tanstack/react-query';
import SectionList from '@/molecule/SectionList';
import CreateChatForm from './CreateChatForm';

export interface Room {
  room_id: string;
  room_name: string;
  room_owner_id: string;
  room_access: 'public' | 'protected' | 'private';
  created: Date;
}

function useAllRooms() {
  const result = useQuery({
    queryKey: ['chat/rooms/all'],
    queryFn: async (): Promise<Room[]> => {
      const res = await fetcher('/chat/rooms/all');
      if (res.ok) {
        const data = await res.json();
        return data.rooms;
      }
      return [];
    },
  });
  return result;
}

function useJoinedRooms() {
  const result = useQuery({
    queryKey: ['chat/rooms/joined'],
    queryFn: async (): Promise<Room[]> => {
      const res = await fetcher('/chat/rooms/joined');
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
  const [room_id, setRoom_Id] = useState<string | null>(null);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const { data: allRooms } = useAllRooms();
  const { data: joinedRooms } = useJoinedRooms();

  const section = [
    {
      title: 'all',
      list: allRooms,
    },
    {
      title: 'joined',
      list: joinedRooms,
    },
  ];
  const mutation = useMutation({
    mutationFn: async (id: string) => {
      return fetcher(`/chat/room/${id}/join`, {
        method: 'POST',
        body: JSON.stringify({ room_password: '' }),
      });
    },
    onSettled: (_data, _error, variables) => {
      setRoom_Id(variables ?? null);
    },
  });

  return (
    <SideBarLayout>
      {room_id ? (
        <ChatingRoom roomId={room_id} setRoom_Id={setRoom_Id} />
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
            <button className='text-xs'>All/Joined</button>
          </div>
          {isOpenForm ? <CreateChatForm /> : null}
          <SectionList
            sections={section}
            renderItem={(room) => (
              <button onClick={() => mutation.mutate(room.room_id)}>
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
