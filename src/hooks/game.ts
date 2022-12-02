import {useSetRecoilState} from "recoil";
import {currentGameStatus} from "@/states/game/currentGameStatus";
import {gameInitialData} from "@/states/game/gameInitialData";
import {matchInfo} from "@/states/game/matchInfo";
import {GameSocketManager} from "@/models/GameSocketManager";

// {
//   "gameInfo": {
//   "owner": "cznUOUFa2b-fl2-5AAAZ",
//     "lPlayerInfo": {
//     "user_id": "32c8540b-3435-4b68-a932-753976b8604f",
//       "nickname": "jaemjung3",
//       "prof_img": null,
//       "mmr": 1020
//   },
//   "rPlayerInfo": {
//     "user_id": "58fbdaff-5dc9-4175-b4eb-8f2f9204b176",
//       "nickname": "oragne",
//       "prof_img": "https://lh3.googleusercontent.com/a/ALm5wu1S3MyGy5B-XTr-YcOPnBqz_eggetTen7LbXNch=s96-c",
//       "mmr": 980
//   }
// },
//   "renderInfo": {
//   "width": 800,
//     "height": 600,
//     "playerHeight": 100,
//     "playerWidth": 10,
//     "ballRadius": 10,
//     "lPlayerX": 0,
//     "rPlayerX": 790
// }
// }

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