import { useState } from 'react';
import { useNotification } from '@/hooks/notification';

import Nav from '@/organism/Nav';
import Chat from '@/organism/Chat';
import Friends from '@/organism/Friends';
import Directmsg from '@/organism/Directmsg';
import UserProfileModal from '@/organism/UserProfileModal';
import GameContainer from '../templates/GameContainer';

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
    </div>
  );
}

export default Main;
