import {useRecoilState} from "recoil";
import {useEffect} from "react";
import {io, Socket} from "socket.io-client";

import {currentGameStatus} from "@/states/game/currentGameStatus";
import {gameSocket} from "@/states/game/gameSocket";

import GameWindow from '@/organism/GameWindow';
import GameOnMatching from "@/molecule/GameOnMatching";
import GameMatched from "@/molecule/GameMatched";
import GameIntro from "@/molecule/GameIntro";
import GameFinished from '@/molecule/GameFinished';
import gameMatched from "@/molecule/GameMatched";

export type GameStatus = 'INTRO' | 'ON_MATCHING' | 'MATCHED' | 'PLAYING' | 'WATCHING' | 'FINISHED';

const GameContainer = () => {

  const [currentStatus, setCurrentStatus] = useRecoilState(currentGameStatus);
  //const [socket, setSocket] = useRecoilState(gameSocket);

  const serverUrl = import.meta.env.VITE_REQUEST_URL;
  const gameSocketUri = `ws://54.164.253.231:9998`;
  const accessToken = window.localStorage.getItem("access_token");

  const gameSocket: Socket = io(gameSocketUri, {
    auth: {
      access_token: accessToken,
    }
  });

  //최초 소켓연결
  useEffect(() => {
    gameSocket.on("connect", () => {
      console.log("connected");
    });
    gameSocket.onAny((event, ...args) => {
      console.log(event, args);
    });
  },[]);

  return (
    <div className="flex flex-col h-full w-full bg-neutral-900">
      {
        {
          "INTRO"       : <GameIntro gameSocket={gameSocket} />,
          "ON_MATCHING" : <GameOnMatching gameSocket={gameSocket}/>,
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
