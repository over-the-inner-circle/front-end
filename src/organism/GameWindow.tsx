import {useRecoilState} from "recoil";

import Game from '@/molecule/Game';
import GamePlayerInfoBar from "@/molecule/GamePlayerInfoBar";
import Spacer from "@/atom/Spacer";
import Button from "@/atom/Button";
import {currentGameStatus} from "@/states/game/currentGameStatus";
import {GameSocketManager} from "@/models/GameSocketManager";


const GameWindow = () => {

  const [gameStatus, setGameStatus] = useRecoilState(currentGameStatus);

  const leaveWatch = () => {
    const socket = GameSocketManager.getInstance().socket;
    if (!socket) return;
    socket.emit('leave_watching_game');
    setGameStatus("INTRO");
  }

  const LeaveWatchingButton = () => {
    if (gameStatus === "WATCHING") {
      return (
        <div className="flex flex-row bg-neutral-900">
          <Spacer />
          <Button className="bg-red-400 text-xs m-2"
                  onClick={leaveWatch}>
            LEAVE
          </Button>
          <Spacer />
        </div>
      )
    } else {
      return null
    }
  }

  return (
    <>
    <GamePlayerInfoBar />
    <LeaveWatchingButton />
    <div className="flex h-full items-center justify-center min-h-0 min-w-0">
      <Game />
    </div>
    </>
  );
}

export default GameWindow;
