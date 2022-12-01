import {useRecoilState} from "recoil";

import Game from '@/molecule/Game';
import GamePlayerInfoBar from "@/molecule/GamePlayerInfoBar";
import Spacer from "@/atom/Spacer";
import Button from "@/atom/Button";
import {currentGameStatus} from "@/states/game/currentGameStatus";


const GameWindow = () => {

  const [gameStatus, setGameStatus] = useRecoilState(currentGameStatus);

  const LeaveWatchingButton = () => {
    if (gameStatus === "WATCHING") {
      return (
        <div className="flex flex-row bg-neutral-800">
          <Spacer />
          <Button className="bg-red-400 text-xs m-2"
                  onClick={() => {
                    setGameStatus("INTRO");
                  }}
          >
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
