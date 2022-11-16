import GameWindow from '@/organism/GameWindow';
import GameOnMatching from "@/molecule/GameOnMatching";
import GameMatched from "@/molecule/GameMatched";
import GameIntro from "@/molecule/GameIntro";

import {useRecoilValue} from "recoil";
import {currentGameStatus} from "@/states/currentGameStatus";

export type GameStatus = 'INTRO' | 'ON_MATCHING' | 'MATCHED' | 'PLAYING';

const GameContainer = () => {

  const currentStatus = useRecoilValue(currentGameStatus);

  return (
    <div className="flex flex-col h-full w-full bg-neutral-900">
      {
        {
          "INTRO" : <GameIntro />,
          "ON_MATCHING" : <GameOnMatching />,
          "MATCHED" : <GameMatched />,
          "PLAYING" : <GameWindow />
        }[currentStatus]
      }
    </div>
  );
}

export default GameContainer;
