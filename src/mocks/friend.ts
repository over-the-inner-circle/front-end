import { rest } from 'msw';
import { type Friend, type RequestedFriend } from '@/hooks/friends';
import { api } from '@/mocks/worker';

const friendAll = rest.get(api('/friend/all'), (_req, res, ctx) => {
  return res(ctx.delay(300), ctx.status(200), ctx.json(friendsData));
});

const friendAllError = rest.get(api('/friend/all'), (_req, res, ctx) => {
  return res(
    ctx.status(404),
    ctx.json({ statusCode: 404, message: '{userId} not found' }),
  );
});

const friendRequestSent = rest.get(
  api('/friend/request/sent'),
  (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(requestedFriendsData));
  },
);

const friendRequestRecv = rest.get(
  api('/friend/request/recv'),
  (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(requestedFriendsData));
  },
);

const friendRequestCancle = rest.delete(
  api('/friend/request/:id'),
  (_req, res, ctx) => {
    return res(ctx.status(204));
  },
);

const friendRequestAccept = rest.post(
  api('/friend/request/:id/accept'),
  (_req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        statusCode: 201,
        message: 'friend relationship created',
      }),
    );
  },
);

const friendRequestReject = rest.post(
  api('/friend/request/:id/reject'),
  (_req, res, ctx) => {
    return res(ctx.status(204));
  },
);

export const handlers = [
  friendAll,
  friendRequestSent,
  friendRequestRecv,
  friendRequestCancle,
  friendRequestAccept,
  friendRequestReject,
];

export const errorHandlers = [friendAllError];

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

const requestedFriendsData: RequestedFriend[] = [
  {
    request_id: 1,
    requester: '7044bd97-a10e-4e81-97c0-f5e07438ab51',
    receiver: '7044bd97-a10e-4e81-97c0-f5e07438ab51',
    created_date: new Date(),
  },
  {
    request_id: 2,
    requester: '7044bd97-a10e-4e81-97c0-f5e07438ab51',
    receiver: '7044bd97-a10e-4e81-97c0-f5e07438ab51',
    created_date: new Date(),
  },
  {
    request_id: 3,
    requester: '7044bd97-a10e-4e81-97c0-f5e07438ab51',
    receiver: '7044bd97-a10e-4e81-97c0-f5e07438ab51',
    created_date: new Date(),
  },
  {
    request_id: 4,
    requester: '7044bd97-a10e-4e81-97c0-f5e07438ab51',
    receiver: '7044bd97-a10e-4e81-97c0-f5e07438ab51',
    created_date: new Date(),
  },
  {
    request_id: 5,
    requester: '7044bd97-a10e-4e81-97c0-f5e07438ab51',
    receiver: '7044bd97-a10e-4e81-97c0-f5e07438ab51',
    created_date: new Date(),
  },
];
