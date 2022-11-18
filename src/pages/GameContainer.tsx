import {useRecoilState} from "recoil";
import {useEffect} from "react";
import {io} from "socket.io-client";

import {currentGameStatus} from "@/states/game/currentGameStatus";
import {gameSocket} from "@/states/game/gameSocket";

import GameWindow from '@/organism/GameWindow';
import GameOnMatching from "@/molecule/GameOnMatching";
import GameMatched from "@/molecule/GameMatched";
import GameIntro from "@/molecule/GameIntro";
import GameFinished from '@/molecule/GameFinished';

export type GameStatus = 'INTRO' | 'ON_MATCHING' | 'MATCHED' | 'PLAYING' | 'FINISHED';

const GameContainer = () => {

  const [currentStatus, setCurrentStatus] = useRecoilState(currentGameStatus);
  const [socket, setSocket] = useRecoilState(gameSocket);

  useEffect(() => {
    // if (!socket) {
    //   setSocket(io("http://localhost:3001"));
    // }
    // if (socket) {
    //   socket.on("disconnect", () => {
    //     // 에러메시지 출력 후
    //     socket.disconnect();
    //     setSocket(null);
    //     setCurrentStatus("INTRO");
    //   });
    // }
  }, []);


  return (
    <div className="flex flex-col h-full w-full bg-neutral-900">
      {
        {
          "INTRO"       : <GameIntro />,
          "ON_MATCHING" : <GameOnMatching />,
          "MATCHED"     : <GameMatched />,
          "PLAYING"     : <GameWindow />,
          "FINISHED"    : <GameFinished />
        }[currentStatus]
      }
    </div>
  );
}

export default GameContainer;
