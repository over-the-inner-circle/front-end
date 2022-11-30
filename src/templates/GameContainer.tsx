import {useRecoilState} from "recoil";
import {useEffect, useRef} from "react";
import {io, Socket} from "socket.io-client";

import {currentGameStatus} from "@/states/game/currentGameStatus";

import GameWindow from '@/organism/GameWindow';
import GameOnMatching from "@/molecule/GameOnMatching";
import GameMatched from "@/molecule/GameMatched";
import GameIntro from "@/molecule/GameIntro";
import GameFinished from '@/molecule/GameFinished';

export type GameStatus = 'INTRO' | 'ON_MATCHING' | 'MATCHED' | 'PLAYING' | 'WATCHING' | 'FINISHED';

const GameContainer = () => {

  const [currentStatus, setCurrentStatus] = useRecoilState(currentGameStatus);

  const gameSocketUri = `ws://54.164.253.231:9998`;
  const accessToken = window.localStorage.getItem("access_token");

  const isFirstMount = useRef(true);
  const gameSocketRef = useRef<Socket>(io(gameSocketUri, {
    auth: { access_token: accessToken },
    autoConnect: false,
    }));

  //최초 소켓연결
  useEffect(() => {
    if (!isFirstMount.current) {
      return;
    }
    gameSocketRef.current.connect();
    gameSocketRef.current.on("connect", () => {
      console.log("connected");
      console.log(gameSocketRef.current.id);
    });

    gameSocketRef.current.on("disconnect", () => {
      console.log("disconnected");
      console.log(gameSocketRef.current.id);
    });

    gameSocketRef.current.on("game_error", (error: any) => {
      console.log(error);
    });
  },[]);

  return (
    <div className="flex flex-col h-full w-full bg-neutral-900">
      {
        {
          "INTRO"       : <GameIntro gameSocket={gameSocketRef} />,
          "ON_MATCHING" : <GameOnMatching gameSocket={gameSocketRef}/>,
          "MATCHED"     : <GameMatched gameSocket={gameSocketRef}/>,
          "PLAYING"     : <GameWindow gameSocket={gameSocketRef}/>,
          "WATCHING"    : <GameWindow gameSocket={gameSocketRef}/>,
          "FINISHED"    : <GameFinished />
        }[currentStatus]
      }
    </div>
  );
}

export default GameContainer;
