import { useState } from 'react';

import Nav from "@/organism/Nav";
import Chat from "@/organism/Chat";
import Friends from "@/organism/Friends";
import Directmsg from "@/organism/Directmsg";
import UserProfileModal from '@/organism/UserProfileModal';
import GameContainer from "../templates/GameContainer";

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
	const [sideState, setSideState] = useState<SidebarItem>("chat");

	return (
		<div className="bg-neutral-600 flex flex-col w-full h-full mx-auto my-0">
			<Nav current={sideState} onChange={setSideState}></Nav>
			<div className="flex h-full w-full min-h-0">
				<GameContainer />
				{sidebarSelector(sideState)}
			</div>
      <UserProfileModal />
		</div>
  );
}

export default Main;
