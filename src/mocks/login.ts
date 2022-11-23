import { SignUpUserInfo } from '@/states/user/signUp';
import { rest } from 'msw';
import { api } from './worker';

export const loginHandler = rest.post(
  api('/auth/oauth2/:provider'),
  async (_req, res, ctx) => {
    let body;
    const { code } = await _req.json();
    if (code === 'some code') {
      body = tokenInfo;
    } else {
      body = userInfo;
    }
    return res(ctx.delay(300), ctx.status(200), ctx.json(body));
  },
);

const userInfo: SignUpUserInfo = {
  provider: '42',
  third_party_id: 'some third party id',
  prof_img: 'some image url',
  locale: 'ko_KR',
};

const tokenInfo = {
  access_token: 'some access token',
  refresh_token: 'some refresh token',
};

