import {atom} from "recoil";

interface GameResult {
  loser: string,
  lPlayer: {
    user_id: string,
    nickname: string,
    prof_img: string,
    mmr: string,
  },
  rPlayer: {
    user_id: string,
    nickname: string,
    prof_img: string,
    mmr: string,
  }
}

export const gameResult = atom<GameResult | null>({
  key: "gameResult",
  default: null
});