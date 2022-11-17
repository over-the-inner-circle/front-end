import Button from '@/atom/Button';
import Game from '@/molecule/Game';
import GamePlayerInfoBar from "@/molecule/GamePlayerInfoBar";
import { currentGameStatus } from '@/states/game/currentGameStatus';
import { useSetRecoilState } from 'recoil';

const GameWindow = () => {

  const setCurrentStatus = useSetRecoilState(currentGameStatus);

  const finishGame = () => {
    setCurrentStatus("FINISHED");
  }

  return (
    <>
    <Button onClick={finishGame}>finish</Button>
    <GamePlayerInfoBar />
    <div className="flex h-full items-center justify-center min-h-0 min-w-0">
      <Game />
    </div>
    </>
  );
}

export default GameWindow;
