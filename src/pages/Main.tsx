import { useEffect, useState } from 'react';
import { useSocketRef } from '@/hooks/chat';

import Nav from '@/organism/Nav';
import Chat from '@/organism/Chat';
import Friends from '@/organism/Friends';
import Directmsg from '@/organism/Directmsg';
import UserProfileModal from '@/organism/UserProfileModal';
import GameContainer from '../templates/GameContainer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

export type SidebarItem = 'dm' | 'friend' | 'chat';

function sidebarSelector(sidebarIndex: SidebarItem) {
  return sidebarIndex === 'dm' ? (
    <Directmsg />
  ) : sidebarIndex === 'friend' ? (
    <Friends />
  ) : (
    <Chat />
  );
}

function useNotification() {
  const socketRef = useSocketRef(`ws://${import.meta.env.VITE_BASE_URL}:1234`);

  useEffect(() => {
    const socket = socketRef.current;

    const handleGame = (data: unknown) => {
      toast(<div className="font-pixel text-xs">{JSON.stringify(data)}</div>, {
        autoClose: false,
      });
    };
    const handleChat = (data: unknown) => {
      toast(<div className="font-pixel text-xs">{JSON.stringify(data)}</div>);
    };
    const handleDM = (data: unknown) => {
      toast(<div className="font-pixel text-xs">{JSON.stringify(data)}</div>);
    };

    socket.on('notification-game', handleGame);
    socket.on('notification-chat', handleChat);
    socket.on('notification-dm', handleDM);

    return () => {
      socket.off('notification-game', handleGame);
      socket.off('notification-chat', handleChat);
      socket.off('notification-dm', handleDM);
    };
  }, [socketRef]);
}

function Main() {
  const [sideState, setSideState] = useState<SidebarItem>('chat');
  useNotification();

  return (
    <div className="mx-auto my-0 flex h-full w-full flex-col bg-neutral-600">
      <Nav current={sideState} onChange={setSideState}></Nav>
      <div className="flex h-full min-h-0 w-full">
        <GameContainer />
        {sidebarSelector(sideState)}
      </div>
      <UserProfileModal />
      <ToastContainer
        position="top-center"
        theme="dark"
        closeOnClick={false}
        closeButton={true}
      />
    </div>
  );
}

export default Main;
