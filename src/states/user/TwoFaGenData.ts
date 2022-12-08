import {atom} from "recoil";

export interface TwoFAGenData {
  "otpauthUrl": string;
  "secret": string;
}

export const twoFAGenDataState = atom<TwoFAGenData | null>({
  key: 'twoFAGenDataState',
  default: null,
})