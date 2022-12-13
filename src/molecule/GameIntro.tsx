import { useSetRecoilState } from 'recoil';
import { useEffect, useState } from "react";

import Button from '@/atom/Button';
import { currentGameStatus } from '@/states/game/currentGameStatus';
import { GameSocketManager } from '@/models/GameSocketManager';

const GameIntro = () => {
  const setGameStatus = useSetRecoilState(currentGameStatus);
  const socketManager = GameSocketManager.getInstance();
  const [isButtonClicked, setIsButtonClicked] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      socketManager.socket?.removeAllListeners('user_is_in_queue');
      console.log('GameIntro unmounted');
    };
  }, []);

  const startMatching = () => {
    const socket = socketManager.socket;
    if (!socket) {
      return;
    }
    if (socket.disconnected) {
      socket.connect();
    }
    //TODO: 여러번 눌렸을 때 어떻게 되는지 체크하기
    if (!isButtonClicked) {
      console.log(socket.id);
      socket.emit('user_join_queue');
      console.log('user_join_queue emitted');
      socket.once('user_is_in_queue', () => {
        console.log('user_is_in_queue received');
        console.log(socket.id);
        setGameStatus('ON_MATCHING');
      });
    }
    setIsButtonClicked(true);
  };

  return (
    <div className="stop-dragging flex h-full w-full items-center justify-center bg-neutral-700">
      <Button
        className="bg-green-600 font-pixel text-2xl text-white drop-shadow-xl"
        onClick={startMatching}
      >
        Start Game
      </Button>
    </div>
  );
};

export default GameIntro;
