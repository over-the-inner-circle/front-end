import {Socket} from "socket.io-client"
import {atom} from "recoil";

export const gameSocket = atom<Socket | null>({
  key: "gameSocket",
  default: null
});