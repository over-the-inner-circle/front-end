import Nav from "@/organism/Nav";
import Game from "@/organism/Game";
import Chat from "@/organism/Chat";


function Temp() {
	  return (
		<div className="w-full h-full relative mx-auto my-0" id="root">
			<Nav></Nav>

			{/*<Game></Game>*/}
			<div className="content-start flex h-full w-full relative pt-[78px]">
				<Game></Game>
				<Chat></Chat>
			{/*	<div className="bg-blue-500 col-span-1 row-span-2 col-start-2 row-start-2 h-full w-[450px]" id="side">side</div>*/}
			</div>


		</div>
  );
}

export default Temp;
