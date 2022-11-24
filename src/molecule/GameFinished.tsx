import Button from "@/atom/Button";
import GameMatchedUserInfo from "@/atom/GameMatchedUserInfo";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { currentGameStatus } from "@/states/game/currentGameStatus";
import { gameResult } from "@/states/game/gameResult";

const GameFinished = () => {
  
  const result = useRecoilValue(gameResult);
  const setGameStatus = useSetRecoilState(currentGameStatus);
  const toIntro = () => {
    setGameStatus("INTRO");
  }

  if (!result) {
    console.log("result or finalScore is null");
    return null;
  }
return (
    <div className="flex flex-col items-center justify-center w-full h-full text-white font-pixel">
        <span className="text-6xl">{"Game Result"}</span>
        <div className="flex flex-row items-center justify-center gap-40 m-20 mb-8">
          <GameMatchedUserInfo name={result.l_player.nickname}
                               eloScore={result.l_player.mmr} />
          <div className="flex flex-col justify-center items-center gap-12">
            <span className="text-5xl whitespace-nowrap "> {result.l_player.score} : {result.r_player.score} </span>
            <span className="text-3xl text-green-600 "> {"+ or -"} </span>
          </div>
          <GameMatchedUserInfo name={result.r_player.nickname}
                               eloScore={result.r_player.mmr} />
        </div>
        <Button className="bg-green-600 text-2xl mt-20" onClick={toIntro}> DONE </Button>
    </div>
  );
}

export default GameFinished