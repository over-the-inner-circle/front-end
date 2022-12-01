import {Socket} from "socket.io-client";
import Game from '@/molecule/Game';
import GamePlayerInfoBar from "@/molecule/GamePlayerInfoBar";


const GameWindow = () => {
  return (
    <>
    <GamePlayerInfoBar />
    <div className="flex h-full items-center justify-center min-h-0 min-w-0">
      <Game />
    </div>
    </>
  );
}

export default GameWindow;
