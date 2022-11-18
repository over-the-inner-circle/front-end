import {useSetRecoilState, useRecoilState} from "recoil";

import Button from "@/atom/Button";
import {currentGameStatus} from "@/states/game/currentGameStatus";
import {gameSocket} from "@/states/game/gameSocket";

const GameIntro = () => {
  const setGameStatus = useSetRecoilState(currentGameStatus);
  const [socket, setSocket] = useRecoilState(gameSocket);

  const startMatching = () => {

    // TODO: 백엔드에 붙일 것
    // const newSocket = io("");
    // if (newSocket.connected) {
    //   setSocket(newSocket);
    // }
    // if (!socket) {
    //   //TODO: 에러처리
    //   console.log("socket is not connected");
    // } else {
    //   socket.emit("user_join_queue");
    //   // TODO: 유저가 큐에 들어갔다는 메시지가 필요할까?
    //   setGameStatus("ON_MATCHING");
    // }

    setGameStatus("ON_MATCHING");
  }

  return(
    <div className="flex h-full w-full items-center justify-center bg-neutral-700 stop-dragging">
      <Button className="bg-green-600 text-white font-pixel text-2xl drop-shadow-xl"
      onClick={startMatching}>
        Start Game
      </Button>
    </div>
  );
}

export default GameIntro