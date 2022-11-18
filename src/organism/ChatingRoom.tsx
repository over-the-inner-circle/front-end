export interface ChatProps {
	title: string;
	setRoom_Id: (room_id: string | null) => void;
}

export interface ChatProps {
	title: string;
}

export default function ChatingRoom({ title, setRoom_Id }: ChatProps) {
	return (
		<div
			className="flex flex-col justify-start items-start
										font-pixel text-white text-sm bg-neutral-600 border-l border-neutral-400
										w-80 h-full"
			>
			<div className="flex justify-between items-center w-full h-10 px-3 border-b bg-neutral-800 border-inherit">
				{title}
				<button onClick={() => setRoom_Id(null)} className="px-1">⬅</button>
			</div>
			<div className="flex flex-col justify-end items-start w-full h-full border-b border-inherit">
				<div className="flex flex-col justify-end items-start w-full h-full border-b border-inherit">
					<li>

					</li>
				</div>
				<div className="flex justify-end items-end h-30">
					<textarea placeholder="plase input here." className="text-black bg-neutral-300 w-full resize-none h-20 border-none" />
					<button className="h-full px-3 border-b bg-neutral-800 border-inherit">send</button>
				</div>
			</div>

		</div>
	);
}

