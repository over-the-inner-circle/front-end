import Button from "@/atom/Button";
import GameMatchedUserInfo from "@/atom/GameMatchedUserInfo";
import { useSetRecoilState } from "recoil";
import { currentGameStatus } from "@/states/game/currentGameStatus";

const GameFinished = () => {
  
  const gameResult: string = "YOU WIN";
  const setGameStatus = useSetRecoilState(currentGameStatus);

  const toIntro = () => {
    setGameStatus("INTRO");
  }
  
return (
    <div className="flex flex-col items-center justify-center w-full h-full text-white font-pixel">
        <span className="text-6xl">{gameResult}</span>
        <div className="flex flex-row items-center justify-center gap-40 m-20 mb-8">
          <GameMatchedUserInfo name="jaemjung" eloScore="1020" />
          <div className="flex flex-col justify-center items-center gap-12">
            <span className="text-5xl whitespace-nowrap "> 10 : 3 </span>
            <span className="text-3xl text-green-600 "> +10 </span>
          </div>
          <GameMatchedUserInfo name="someone" eloScore="1980" />
        </div>
        <Button className="bg-green-600 text-2xl mt-20" onClick={toIntro}> DONE </Button>
    </div>
  );
}

export default GameFinished