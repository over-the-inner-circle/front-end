import { useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { RoomInfo, roomInfoState } from '@/states/roomInfoState';
import { RoomListType, useJoinRoom, useRoomList } from '@/hooks/chat';
import SideBarLayout from '@/molecule/SideBarLayout';
import SideBarHeader from '@/molecule/SideBarHeader';
import SectionList from '@/molecule/SectionList';
import ChatingRoom from '@/organism/ChatingRoom';
import CreateChatForm from '@/organism/CreateChatForm';

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
      <SideBarHeader>
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
      </SideBarHeader>
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
