import {useSetRecoilState} from "recoil";
import {useEffect} from "react";

import Button from "@/atom/Button";

import {currentGameStatus} from "@/states/game/currentGameStatus";
import {matchInfo} from "@/states/game/matchInfo";
import {GameSocketManager} from "@/models/GameSocketManager";

export interface MatchedUserInfo {
  "user_id": string,
  "nickname": string,
  "prof_img": string | null,
  "mmr": number
}

export interface MatchInfo {
  "owner": string,
  "lPlayerInfo": MatchedUserInfo,
  "rPlayerInfo": MatchedUserInfo,
}

const GameOnMatching = () => {

  const socketManager = GameSocketManager.getInstance();
  const setGameStatus = useSetRecoilState(currentGameStatus);
  const setMatchedPlayerInfo = useSetRecoilState(matchInfo);

  useEffect(() => {

    const socket = socketManager.socket;
    if (!socket) {
      console.log("socket is null");
      return;
    }

    //TODO: 에러처리
    console.log("GameOnMatching mounted");
    socket.once('player_matched', (data: string) => {
      console.log("player_matched received");
      console.log(data);

      socket.emit('user_join_room', data);
      console.log('user_join_room emitted');
    });

    socket.once('user_joined_room', (data: MatchInfo) => {
      console.log("user_joined_room received");
      console.log(data);
      setMatchedPlayerInfo(data);
      setGameStatus("MATCHED");
    });

    socket.once('user_exit_room', () => {
      console.log("user_exit_room received");
      setGameStatus("INTRO");
    })

    return () => {
      socket.removeAllListeners('player_matched');
      socket.removeAllListeners('user_joined_room');
      socket.removeAllListeners('user_exit_room');
      console.log("GameOnMatching unmounted");
    }

  }, []);

  const cancelMatching = () => {
    socketManager.socket?.emit("user_left_queue");
    console.log("user_left_queue emitted");
    setGameStatus("INTRO");
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full stop-dragging">
      <span className="text-white font-pixel text-2xl">
        Matching...
      </span>
      <Button onClick={cancelMatching}
              className="bg-red-500 text-white font-pixel mt-10">
        cancel
      </Button>
    </div>
  )
}

export default GameOnMatching;
