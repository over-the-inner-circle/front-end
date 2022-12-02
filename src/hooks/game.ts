import {useSetRecoilState} from "recoil";
import {currentGameStatus} from "@/states/game/currentGameStatus";
import {gameInitialData} from "@/states/game/gameInitialData";
import {matchInfo} from "@/states/game/matchInfo";
import {GameSocketManager} from "@/models/GameSocketManager";
import {MatchInfo} from "@/molecule/GameOnMatching";

export const useRequestWatchGame = () => {

  const setGameStatus = useSetRecoilState(currentGameStatus);
  const setGameInitialData = useSetRecoilState(gameInitialData);
  const setMatchInfo = useSetRecoilState(matchInfo)

  return (player: string) => {
    const socket = GameSocketManager.getInstance().socket;
    if (!socket) {
      return
    }
    socket.emit('watch_game', player);
    socket.once("watch_game_ready_to_start", (data) => {
      if (data) {
        setMatchInfo(data.gameInfo);
        setGameInitialData(data.renderInfo);
        setGameStatus("WATCHING");
      } else {
        console.log("watch_game_ready_to_start: data is null");
      }
    })
  };
}

export const useRequestNormalGame = () => {
  const setGameStatus = useSetRecoilState(currentGameStatus);
  const setMatchInfo = useSetRecoilState(matchInfo);

  return (player: string) => {
    const socket = GameSocketManager.getInstance().socket;
    if (!socket) return
    socket.emit('user_create_friendly_room', player);
    //알림 발송
    socket.once("user_joined_room", (data: MatchInfo) => {
      if (data) {
        setMatchInfo(data);
        socket.removeAllListeners("user_exit_room");
        setGameStatus("MATCHED");
      }
    })
    socket.once("user_exit_room", () => {
      socket.removeAllListeners("user_joined_room");
      setGameStatus("INTRO");
    })
  }
}