import Button from "@/atom/Button";
import {useSetRecoilState} from "recoil";
import {currentGameStatus} from "@/states/currentGameStatus";

const GameIntro = () => {

  const setGameStatus = useSetRecoilState(currentGameStatus);
  const startMatching = () => {
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