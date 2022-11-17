import {atom} from "recoil";
import {GameStatus} from "@/pages/GameContainer";

export const currentGameStatus = atom<GameStatus>({
  key: "currentGameStatus",
  default: "INTRO"
});