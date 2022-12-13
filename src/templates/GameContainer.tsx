import { useRecoilState, useRecoilValue } from 'recoil';
import { useEffect } from 'react';

import { currentGameStatus } from '@/states/game/currentGameStatus';
import { accessTokenState } from '@/states/user/auth';

import GameWindow from '@/organism/GameWindow';
import GameOnMatching from '@/molecule/GameOnMatching';
import GameMatched from '@/molecule/GameMatched';
import GameIntro from '@/molecule/GameIntro';
import GameFinished from '@/molecule/GameFinished';

import { GameSocketManager } from '@/models/GameSocketManager';
import { toast } from 'react-toastify';

export type GameStatus =
  | 'INTRO'
  | 'ON_MATCHING'
  | 'MATCHED'
  | 'PLAYING'
  | 'WATCHING'
  | 'FINISHED';

const GameContainer = () => {
  const [currentStatus, setCurrentStatus] = useRecoilState(currentGameStatus);

  const gameSocketUri = `ws://54.164.253.231:9998`;
  const accessToken = useRecoilValue(accessTokenState);

  const gameSocketManager = GameSocketManager.getInstance();

  useEffect(() => {
    if (accessToken) {
      gameSocketManager.initSocket(gameSocketUri, accessToken);
    }
    return () => {
      gameSocketManager.socket?.disconnect();
      console.log('GameContainer unmounted');
    };
  }, [gameSocketManager, accessToken]);

  //최초 소켓연결
  useEffect(() => {
    // socket should be initiated before using;
    const gameSocket = gameSocketManager.socket;
    if (gameSocket) {
      gameSocket.on('connect', () => {
        console.log('connected');
        console.log(gameSocket.id);
      });

      gameSocket.on('disconnect', () => {
        console.log('disconnected');
        toast.error(
          'lost connection to the game server.\nplease refresh the page',
        );
        setCurrentStatus('INTRO');
      });

      gameSocket.on('game_error', (error: string) => {
        toast.error(error);
      });

      // gameSocket.on('matching_queue', (data) => {
      //   console.log(`matching_queue: ${data}`);
      // });
      //
      // gameSocket.on('clients', (data) => {
      //   console.log(`clients: ${data}`);
      // });
    }

    return () => {
      gameSocket?.removeAllListeners();
    };
  }, [gameSocketManager]);

  return (
    <div className="flex h-full w-full flex-col bg-neutral-900">
      {
        {
          INTRO: <GameIntro />,
          ON_MATCHING: <GameOnMatching />,
          MATCHED: <GameMatched />,
          PLAYING: <GameWindow />,
          WATCHING: <GameWindow />,
          FINISHED: <GameFinished />,
        }[currentStatus]
      }
    </div>
  );
};

export default GameContainer;
