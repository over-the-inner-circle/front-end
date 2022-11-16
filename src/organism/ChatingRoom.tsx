export interface Message {
	user: string;
	message: string;
}

export interface ChatProps {
	messages: Message[];
}

export default function Chat() {
	return (
		console.log("chat")
	);
}

