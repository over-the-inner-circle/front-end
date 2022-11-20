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

  const gameSocketUri = "";
  const accessToken = window.localStorage.getItem("access_token");

  // 최초 소켓연결
  useEffect(() => {
    // if (!socket) {
    //   const newSocket = io(gameSocketUri, {
    //     auth: {
    //       token: accessToken
    //     }
    //   });
    //   setSocket(newSocket);
    // }
  },[]);

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
