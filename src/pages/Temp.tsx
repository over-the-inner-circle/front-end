import React, { useState } from 'react';

import Nav from "@/organism/Nav";
import Chat from "@/organism/Chat";
import Friends from "@/organism/Friends";
import Directmsg from "@/organism/Directmsg";
import GameContainer from "./GameContainer";

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

function Temp() {
	const [sideState, setSideState] = useState<SidebarItem>("chat");

	return (
		<div className="bg-neutral-600 flex flex-col w-full h-full relative mx-auto my-0" id="root">
			<Nav current={sideState} onChange={setSideState}></Nav>
			<div className="content-start flex h-full w-full relative">
				<GameContainer />
				{sidebarSelector(sideState)}
			</div>


		</div>
  );
}

export default Temp;
