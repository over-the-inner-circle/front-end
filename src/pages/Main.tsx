import { useNotification } from '@/hooks/notification';

import Nav from '@/organism/Nav';
import Chat from '@/organism/Chat';
import Friends from '@/organism/Friends';
import Directmsg from '@/organism/Directmsg';
import UserProfileModal from '@/organism/UserProfileModal';
import GameContainer from '../templates/GameContainer';
import { useRecoilValue } from 'recoil';
import { currentSideBarItemState } from '@/states/currentSideBarItemState';

function SidebarSelector() {
  const currentSideBarItem = useRecoilValue(currentSideBarItemState);

  return currentSideBarItem === 'dm' ? (
    <Directmsg />
  ) : currentSideBarItem === 'friend' ? (
    <Friends />
  ) : (
    <Chat />
  );
}

function Main() {
  useNotification();

  return (
    <div className="mx-auto my-0 flex h-full w-full flex-col bg-neutral-600">
      <Nav />
      <div className="flex h-full min-h-0 w-full">
        <GameContainer />
        <SidebarSelector />
      </div>
      <UserProfileModal />
    </div>
  );
}

export default Main;
