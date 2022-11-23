import {useSetRecoilState, useRecoilValue} from "recoil";
import React, {useEffect, useState} from "react";

import {PongTheme, availablePongThemes} from "@/models/Pong";

import GameMatchedUserInfo from "@/atom/GameMatchedUserInfo";
import Button from "@/atom/Button";

import {currentGameStatus} from "@/states/game/currentGameStatus";
import {matchInfo} from "@/states/game/matchInfo";
import {gameTheme} from "@/states/game/gameTheme";
import {gameInitialData} from "@/states/game/gameInitialData";
import {Socket} from "socket.io-client";

export interface GameInitialData {
    width: number,
    height: number,
    playerHeight: number,
    playerWidth: number,
    ballRadius: number,
    lPlayerX: number,
    rPlayerX: number,
}

interface GameMatchedProps {
  gameSocket: Socket;
}

const GameMatched = (props: GameMatchedProps) => {

  const setGameStatus = useSetRecoilState(currentGameStatus);
  const setPongTheme = useSetRecoilState(gameTheme);
  const setGameInitialData = useSetRecoilState(gameInitialData);

  const currentMatchInfo = useRecoilValue(matchInfo);

  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);
  const [isCounterpartReady, setIsCounterpartReady] = useState<boolean>(false);
  const [gameDifficulty, setGameDifficulty ] = useState<number>(2);

  const socket = props.gameSocket;

  useEffect(() => {

    // 에러처리
    if (!currentMatchInfo || !socket) {
      console.error("currentMatchInfo or socket is null");
      setGameStatus("INTRO");
    }

    socket.on('difficulty_changed', (changedDifficulty: number) => {
      console.log("difficulty_changed received");
      console.log(changedDifficulty);
      setGameDifficulty(changedDifficulty);
    });

    socket.on('counterpart_ready', () => {
      console.log("counterpart_ready received");
      setIsCounterpartReady(true);
    });

    socket.once('server_ready_to_start', (data: GameInitialData) => {
      console.log("server_ready_to_start received");
      console.log(data);
      setGameInitialData(data);
      setGameStatus("PLAYING");
    });

    return () => {
      socket.removeAllListeners('difficulty_changed');
      socket.removeAllListeners('counterpart_ready');
      socket.removeAllListeners('server_ready_to_start');
      console.log("GameMatched unmounted");
    }
  }, []);

  const playerReady = () => {

    setIsPlayerReady(true);
    socket.emit('player_ready');

  }

  const changeGameDifficulty = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                             difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        socket.emit("player_change_difficulty", "1");
        break;
      case "NORMAL":
        socket.emit("player_change_difficulty", "2");
        break;
      case "HARD":
        socket.emit("player_change_difficulty", "3");
        break;
      default:
        console.error("difficulty is not valid");
    }
  }

  const setGameTheme = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                        themeNumber: number) => {
    setPongTheme(availablePongThemes()[themeNumber]);
  }

  if (!currentMatchInfo) {
    return null;
  }
  return (
    <div className="h-full w-full flex flex-col font-pixel text-white justify-center items-center stop-dragging">
      <div className="flex justify-center gap-52">
        <GameMatchedUserInfo name={currentMatchInfo.lPlayerInfo.nickname}
                             eloScore={currentMatchInfo.lPlayerInfo.mmr}/>
        <GameMatchedUserInfo name={currentMatchInfo.rPlayerInfo.nickname}
                             eloScore={currentMatchInfo.rPlayerInfo.mmr}/>
      </div>
      <div className="flex flex-col items-center">
        <span className="m-4 mt-10 text-xl">Game settings</span>
        <span className="m-2">Difficulty</span>
        <div className="flex flex-row gap-8">
          <Button onClick={(e) => {changeGameDifficulty(e, "EASY")}}
                  className="bg-green-400 text-white font-pixel">
            easy
          </Button>
          <Button onClick={(e) => {changeGameDifficulty(e, "NORMAL")}}
                  className="bg-yellow-500 text-white font-pixel">
            normal
          </Button>
          <Button onClick={(e) => {changeGameDifficulty(e, "HARD")} }
                  className="bg-red-500 text-white font-pixel">
            hard
          </Button>
        </div>
        <span className="m-2 mt-6">Theme</span>
        <div className="flex flex-row gap-8">
          <Button onClick={(e) => {setGameTheme(e, 0)}}
                  className="bg-neutral-600"> theme1 </Button>
          <Button onClick={(e) => {setGameTheme(e, 1)}}
                  className="bg-neutral-600 text-hot-green"> theme2 </Button>
          <Button onClick={(e) => {setGameTheme(e, 2)}}
                  className="bg-neutral-600 text-hot-pink"> theme3 </Button>
        </div>
        <Button className="bg-green-700 text-xl mt-10"
        onClick={playerReady}> READY </Button>
      </div>
    </div>
  );
}

export default GameMatched