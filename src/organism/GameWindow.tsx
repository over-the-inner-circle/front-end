import Game from '@/molecule/Game';
import GamePlayerInfo from "@/molecule/GamePlayerInfo";

const GameWindow = () => {
  return (
    <>
    <GamePlayerInfo />
          <div className="flex h-full items-center justify-center min-h-0 min-w-0">
            <Game />
          </div>
    </>
  );
}

export default GameWindow;
