import { useState } from "react";
import io from "socket.io-client"
import SideBar from "@/organism/SideBar";

const Chat = () => {
	const socketClient = io("http://ip:port");

	return (
		<SideBar title="Chat" />

	);
}

export default Chat;