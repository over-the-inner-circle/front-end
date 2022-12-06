import {useSetRecoilState} from "recoil";
import {useEffect} from "react";

import Button from "@/atom/Button";
import {currentGameStatus} from "@/states/game/currentGameStatus";
import {GameSocketManager} from "@/models/GameSocketManager";

const GameIntro = () => {
  const setGameStatus = useSetRecoilState(currentGameStatus);
  const socketManager = GameSocketManager.getInstance();

  useEffect(() => {
    return () => {
      socketManager.socket?.removeAllListeners('user_is_in_queue');
      console.log("GameIntro unmounted");
    }
  }, [])

  const startMatching = () => {

    const socket = socketManager.socket;
    if (!socket) { return; }
    if (socket.disconnected) { socket.connect(); }
    //TODO: 여러번 눌렸을 때 어떻게 되는지 체크하기
    console.log(socket.id);
    socket.emit("user_join_queue");
    console.log("user_join_queue emitted");
    socket.once("user_is_in_queue", () => {
      console.log("user_is_in_queue received");
      console.log(socket.id);
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