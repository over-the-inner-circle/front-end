import { useState } from "react";

import SideBar from "@/organism/SideBar";
import ChatingRoom from "@/organism/ChatingRoom";


const Chat = () => {
	const [room_id, setRoom_Id] = useState<string | null>(null);

	if (room_id === null) {
		return <SideBar title={"Chat"} setRoom_Id={setRoom_Id} />;
	}
	return (
		<ChatingRoom title={room_id} setRoom_Id={setRoom_Id} />
	);
}

export default Chat;