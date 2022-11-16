import Button from "@/atom/Button";
import {useSetRecoilState} from "recoil";
import {currentGameStatus} from "@/states/currentGameStatus";

const GameOnMatching = () => {

  const setGameStatus = useSetRecoilState(currentGameStatus);

  const gameMatched = () => {
    setGameStatus("MATCHED");
  }

  const cancelMatching = () => {
    console.log("cancel matching");
    setGameStatus("INTRO");
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full stop-dragging">
      <span className="text-white font-pixel text-2xl"
      onClick={gameMatched}> Matching... </span>
      <Button onClick={cancelMatching}
              className="bg-red-500 text-white font-pixel mt-10">
                cancel
      </Button>
    </div>
  )
}

export default GameOnMatching;