import {useSetRecoilState} from "recoil";
import {currentGameStatus} from "@/states/game/currentGameStatus";
import {gameInitialData} from "@/states/game/gameInitialData";
import {matchInfo} from "@/states/game/matchInfo";
import {GameSocketManager} from "@/models/GameSocketManager";
import {MatchInfo} from "@/molecule/GameOnMatching";
import {useFetcher} from "@/hooks/fetcher";
import {toast} from "react-toastify";
import {useEffect} from "react";

export const useRequestWatchGame = () => {

  const setGameStatus = useSetRecoilState(currentGameStatus);
  const setGameInitialData = useSetRecoilState(gameInitialData);
  const setMatchInfo = useSetRecoilState(matchInfo)

  return (player: string) => {
    const socket = GameSocketManager.getInstance().socket;
    if (!socket) {
      return;
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
  const fetcher = useFetcher();

  const waitNormalGameMatched = (player: string) => {
    const socket = GameSocketManager.getInstance().socket;

    if (!socket) return ;
    toast.success("Invitation is successfully sent");
    socket.emit('user_create_friendly_room', player);
    socket.once("user_joined_room", (data: MatchInfo) => {
      if (data) {
        console.log(data);
        setMatchInfo(data);
        setGameStatus("MATCHED");
      }
    })
  }

  useEffect(() => {
    return () => {
      const socket = GameSocketManager.getInstance().socket;
      if (!socket) return ;
      socket.removeAllListeners("user_joined_room");
    }
  }, [])

  return (player: string) => {
    // 알림 발송
    const result = fetcher(`/game/invitation/${player}`);
    result.then(res => {
      if (res.ok) {
        waitNormalGameMatched(player);
      } else {
        toast.error("Invitation is failed");
        res.json().then((data) => {
          console.log(data);
        })
      }
    })
  }
}

export const useAcceptNormalGameInvitation = () => {
  const setGameStatus = useSetRecoilState(currentGameStatus);
  const setMatchInfo = useSetRecoilState(matchInfo);


  useEffect(() => {
    return () => {
      const socket = GameSocketManager.getInstance().socket;
      if (socket) {
        socket.removeAllListeners("user_joined_room");
      }
    }
  })

  return (player: string) => {
    const socket = GameSocketManager.getInstance().socket;
    if (!socket) {
      toast.error("Invitation is failed");
      return ;
    }
    socket.emit('user_join_friendly_room', player);
    socket.once("user_joined_room", (data: MatchInfo) => {
      if (data) {
        console.log(data);
        setMatchInfo(data);
        setGameStatus("MATCHED");
      }
    })
  }
}
