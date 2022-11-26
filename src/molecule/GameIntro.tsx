import {useSetRecoilState} from "recoil";
import {Socket} from "socket.io-client";
import {useEffect} from "react";

import Button from "@/atom/Button";
import {currentGameStatus} from "@/states/game/currentGameStatus";

interface gameIntroProps {
  gameSocket: Socket;
}

const GameIntro = ( props: gameIntroProps ) => {
  const setGameStatus = useSetRecoilState(currentGameStatus);
  const socket = props.gameSocket;

  useEffect(() => {
    return () => {
      socket.removeAllListeners('user_is_in_queue');
      console.log("GameIntro unmounted");
    }
  }, [])

  const startMatching = () => {
    //TODO: 여러번 눌렸을 때 어떻게 되는지 체크하기
    socket.emit("user_join_queue");
    console.log("user_join_queue emitted");
    socket.once("user_is_in_queue", () => {
      console.log("user_is_in_queue received");
      setGameStatus("ON_MATCHING");
    });
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