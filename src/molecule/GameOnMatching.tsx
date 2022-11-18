import {useSetRecoilState, useRecoilValue} from "recoil";
import {useEffect} from "react";

import Button from "@/atom/Button";
import {currentGameStatus} from "@/states/game/currentGameStatus";
import {matchInfo} from "@/states/game/matchInfo";
import {gameSocket} from "@/states/game/gameSocket";

interface GameRoomId {
  roomId: string;
}

export interface MatchInfo {
  roomOwnerSocketId: string;
  counterpartName: string;
  counterpartELO: string;
  counterpartProfileImage: string;
}

const GameOnMatching = () => {

  const socket = useRecoilValue(gameSocket);
  const setGameStatus = useSetRecoilState(currentGameStatus);
  const setMatchedPlayerInfo = useSetRecoilState(matchInfo);

  useEffect(() => {
    if (socket) {
      //TODO: 에러처리

      socket.once('player_matched', (data: GameRoomId) => {
        socket.emit('user_join_room', data.roomId);
      });

      socket.once('user_joined_room', (data: MatchInfo) => {
        setMatchedPlayerInfo(data);
        setGameStatus("MATCHED");
      });
    }
  }, []);

  const gameMatched = () => {
    setGameStatus("MATCHED");
  }

  const cancelMatching = () => {
    console.log("cancel matching");
    setGameStatus("INTRO");
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full stop-dragging">
      <span className="text-white font-pixel text-2xl"
      onClick={gameMatched}> Matching... </span> {/* TODO: 서버에 붙으면 OnClick 이벤트 삭제 */}
      <Button onClick={cancelMatching}
              className="bg-red-500 text-white font-pixel mt-10">
                cancel
      </Button>
    </div>
  )
}

export default GameOnMatching;