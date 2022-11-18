import { useState } from "react";
import ChatingRoom from "@/organism/ChatingRoom";


const Chat = () => {
	const [room_id, setRoom_Id] = useState<string | null>(null);

	if (room_id === null) {
		return null;
	}
	return (
		<ChatingRoom title={room_id} setRoom_Id={setRoom_Id} />
	);
}

export default Chat;