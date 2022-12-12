import {useRecoilState, useRecoilValue} from "recoil";
import {useEffect, useRef} from "react";

import {currentGameStatus} from "@/states/game/currentGameStatus";
import {accessTokenState} from "@/states/user/auth";

import GameWindow from '@/organism/GameWindow';
import GameOnMatching from "@/molecule/GameOnMatching";
import GameMatched from "@/molecule/GameMatched";
import GameIntro from "@/molecule/GameIntro";
import GameFinished from '@/molecule/GameFinished';

import {GameSocketManager} from "@/models/GameSocketManager";
import {toast} from "react-toastify";

export type GameStatus = 'INTRO' | 'ON_MATCHING' | 'MATCHED' | 'PLAYING' | 'WATCHING' | 'FINISHED';

const GameContainer = () => {

  const [currentStatus, setCurrentStatus] = useRecoilState(currentGameStatus);

  const gameSocketUri = `ws://54.164.253.231:9998`;
  const accessToken = useRecoilValue(accessTokenState);

  const isSocketInitiated = useRef(false);
  const gameSocketManager = GameSocketManager.getInstance();

  //최초 소켓연결
  useEffect(() => {
    if (isSocketInitiated.current) { return; }
    if (!accessToken) { return; }

    // socket should be initiated before using;
    gameSocketManager.initSocket(gameSocketUri, accessToken);
    isSocketInitiated.current = true;

    const gameSocket = gameSocketManager.socket;
    if (!gameSocket) { return; }

    gameSocket.on("connect", () => {
      console.log("connected");
      console.log(gameSocket.id);
    });

    gameSocket.on("disconnect", () => {
      console.log("disconnected");
      toast.error("lost connection to the game server.\nplease refresh the page");
      setCurrentStatus("INTRO");
    });

    gameSocket.on("game_error", (error: string) => {
      toast.error(error);
    });

    return () => {
      console.log("GameContainer unmounted");
    }
  },[accessToken]);

  return (
    <div className="flex flex-col h-full w-full bg-neutral-900">
      {
        {
          "INTRO"       : <GameIntro />,
          "ON_MATCHING" : <GameOnMatching />,
          "MATCHED"     : <GameMatched />,
          "PLAYING"     : <GameWindow />,
          "WATCHING"    : <GameWindow />,
          "FINISHED"    : <GameFinished />
        }[currentStatus]
      }
    </div>
  );
}

export default GameContainer;
