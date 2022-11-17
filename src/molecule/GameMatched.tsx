import {useSetRecoilState, useRecoilValue, useRecoilState} from "recoil";
import React, {useEffect, useState} from "react";

import GameMatchedUserInfo from "@/atom/GameMatchedUserInfo";
import Button from "@/atom/Button";
import {currentGameStatus} from "@/states/game/currentGameStatus";
import {matchInfo} from "@/states/game/matchInfo";
import {gameSocket} from "@/states/game/gameSocket";

const GameMatched = () => {
  const setGameStatus = useSetRecoilState(currentGameStatus);
  const currentMatchInfo = useRecoilValue(matchInfo);
  const [socket, setSocket] = useRecoilState(gameSocket);
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);
  const [isCounterpartReady, setIsCounterpartReady] = useState<boolean>(false);

  useEffect(() => {
    // 유저 인포 안넘어올시 or 소켓 없을 시 에러처리
    // if (!currentMatchInfo || !socket) {
    //   console.error("currentMatchInfo or socket is null");
    //   setGameStatus("INTRO");
    // }

    socket?.on('counterpart_ready', () => {
      setIsCounterpartReady(true);
    })

  }, []);

  const playerReady = () => {
    if (socket && socket.connected) {
      setIsPlayerReady(true);
      socket.emit('player_ready');
    } else {
      console.error("socket is not connected");
    }

    // TODO: 완성 시 삭제
    setGameStatus("PLAYING");
  }

  const setGameDifficulty = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                             difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        socket?.emit("player_change_difficulty", "1");
        break;
      case "NORMAL":
        socket?.emit("player_change_difficulty", "2");
        break;
      case "HARD":
        socket?.emit("player_change_difficulty", "3");
        break;
      default:
        console.error("difficulty is not valid");
    }
  }

  return (
    <div className="h-full w-full flex flex-col font-pixel text-white justify-center items-center stop-dragging">
      <div className="flex justify-center gap-52">
        <GameMatchedUserInfo name={"jaemjung"} eloScore={"1000"}/>
        <GameMatchedUserInfo name={"jaehwkim"} eloScore={"2000"}/>
      </div>
      <div className="flex flex-col items-center">
        <span className="m-4 mt-10 text-xl">Game settings</span>
        <span className="m-2">Difficulty</span>
        <div className="flex flex-row gap-8">
          <Button onClick={(e) => {setGameDifficulty(e, "EASY")}}
                  className="bg-green-400 text-white font-pixel">
            easy
          </Button>
          <Button onClick={(e) => {setGameDifficulty(e, "NORMAL")}}
                  className="bg-yellow-500 text-white font-pixel">
            normal
          </Button>
          <Button onClick={(e) => {setGameDifficulty(e, "HARD")} }
                  className="bg-red-500 text-white font-pixel">
            hard
          </Button>
        </div>
        <span className="m-2 mt-6">Theme</span>
        <div className="flex flex-row gap-8">
          <Button className="bg-neutral-500"> theme1 </Button>
          <Button className="bg-neutral-500"> theme2 </Button>
          <Button className="bg-neutral-500"> theme3 </Button>
        </div>
        <Button className="bg-green-700 text-xl mt-10"
        onClick={playerReady}> READY </Button>
      </div>
    </div>
  );
}

export default GameMatched