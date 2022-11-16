import GameMatchedUserInfo from "@/atom/GameMatchedUserInfo";
import Button from "@/atom/Button";
import {useSetRecoilState} from "recoil";
import {currentGameStatus} from "@/states/currentGameStatus";

const GameMatched = () => {

  const setGameStatus = useSetRecoilState(currentGameStatus);

  const startGame = () => {
    setGameStatus("PLAYING");
  }

  return (
    <div className="h-full w-full flex flex-col font-pixel text-white justify-center items-center stop-dragging">
      <div className="flex justify-center gap-52">
        <GameMatchedUserInfo name={"jaemjung"} eloScore={"1000"}/>
        <GameMatchedUserInfo name={"someone"} eloScore={"2000"}/>
      </div>
      <div className="flex flex-col items-center">
        <span className="m-4 mt-10 text-xl">Game settings</span>
        <span className="m-2">Difficulty</span>
        <div className="flex flex-row gap-8">
          <Button className="bg-green-400 text-white font-pixel"> easy </Button>
          <Button className="bg-yellow-500 text-white font-pixel"> normal </Button>
          <Button className="bg-red-500 text-white font-pixel"> hard </Button>
        </div>
        <span className="m-2 mt-6">Theme</span>
        <div className="flex flex-row gap-8">
          <Button className="bg-neutral-500"> theme1 </Button>
          <Button className="bg-neutral-500"> theme2 </Button>
          <Button className="bg-neutral-500"> theme3 </Button>
        </div>
        <Button className="bg-green-700 text-xl mt-10"
        onClick={startGame}> READY </Button>
      </div>
    </div>
  );
}

export default GameMatched