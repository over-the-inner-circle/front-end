import {atom} from "recoil";

export interface TwoFAGenData {
  otp_auth_url: string;
}

export const twoFAGenDataState = atom<TwoFAGenData | null>({
  key: 'twoFAGenDataState',
  default: null,
})