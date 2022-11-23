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
  //const [socket, setSocket] = useRecoilState(gameSocket);

  const serverUrl = import.meta.env.VITE_REQUEST_URL;
  const gameSocketUri = `ws://54.164.253.231:9998`;
  const accessToken = window.localStorage.getItem("access_token");

  const gameSocketRef = useRef<Socket>(io(gameSocketUri, {
    auth: { access_token: accessToken }}
  ));

  //최초 소켓연결
  useEffect(() => {
    const socket = gameSocketRef.current;

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });

    socket.on("game_error", (error: any) => {
      console.log(error);
    });
    // gameSocket.onAny((event, ...args) => {
    //   console.log(event, args);
    // });
  },[]);

  return (
    <div className="flex flex-col h-full w-full bg-neutral-900">
      {
        {
          "INTRO"       : <GameIntro gameSocket={gameSocketRef.current} />,
          "ON_MATCHING" : <GameOnMatching gameSocket={gameSocketRef.current}/>,
          "MATCHED"     : <GameMatched gameSocket={gameSocketRef.current}/>,
          "PLAYING"     : <GameWindow gameSocket={gameSocketRef.current}/>,
          "WATCHING"    : <GameWindow gameSocket={gameSocketRef.current}/>,
          "FINISHED"    : <GameFinished />
        }[currentStatus]
      }
    </div>
  );
}

export default GameContainer;
