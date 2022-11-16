import { rest } from 'msw';
import { type Friend } from '@/organism/Friends';

export const friendAll = rest.get('/friend/all', (_req, res, ctx) => {
  return res(ctx.delay(300), ctx.status(200), ctx.json(friendsData));
});

export const friendAllError = rest.get('/friend/all', (_req, res, ctx) => {
  return res(
    ctx.status(404),
    ctx.json({ statusCode: 404, message: '{userId} not found' }),
  );
});

const friendsData: Friend[] = [
  {
    user_id: '1',
    nickname: 'nickname1',
    prof_img: 'https://via.placeholder.com/65',
    status: 'online',
    created: new Date(),
  },
  {
    user_id: '2',
    nickname: 'nickname2',
    prof_img: 'https://via.placeholder.com/65',
    status: 'ingame',
    created: new Date(),
  },
  {
    user_id: '3',
    nickname: 'tooMuchLongNickname1',
    prof_img: 'https://via.placeholder.com/65',
    status: 'offline',
    created: new Date(),
  },
  {
    user_id: '4',
    nickname: 'tooMuchLongNickname2',
    prof_img: 'https://via.placeholder.com/65',
    status: 'offline',
    created: new Date(),
  },
];
