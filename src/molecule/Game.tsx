import React, { useRef, useEffect, useState } from 'react';
import Pong, { PongComponentsPositions } from "@/models/Pong";
import useSocket from "@/hooks/useSocket";

const socketUri = ():string => {
  const requestUri = import.meta.env.VITE_REQUEST_URL;
  // TODO: 소켓 요청하기
  // const soketUri = fetch(requestUri) {
  //
  // }
  const socketUri = '';
  return socketUri;
}

const Game = () => {
  const isInitialMount = useRef(true);

  const canvasWidth = 640;
  const canvasHeight = 480;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pong, setPong] = useState<Pong | null>(null);
  const [positions, setPositions] = useState<PongComponentsPositions>({
    p1YPosition: (canvasHeight - 100) / 2,
    p2YPosition: (canvasHeight - 100) / 2,
    ballXPosition: canvasWidth / 2,
    ballYPosition: canvasHeight / 2,
  });

  const socket = useSocket(socketUri());

  useEffect( () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (context) {
      setPong(new Pong(context));
    }
  }, []);

  useEffect(() => {
    // 마운트 시 실행안함
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (pong) {
        pong.updateCurrentPositions(positions);
        pong.render();
      }
    }
  }, [positions]);

  const updatePosition = (newPositions: PongComponentsPositions) => {
    //TODO: 서버에서 정보 받아서 status 업데이트
    setPositions(newPositions);
  }

  const sendPressedKey = (type: string) => {
    if (socket) {
      socket.emit('pressedKey', type);
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    // TODO: 서버에 키보드 입력 쏴주기
    // TODO: keyUP과 keyDown을 구분해서 보내기

    if (event.key === 'ArrowUp') {
      updatePosition({ ...positions, p1YPosition: positions.p1YPosition - 10 });
    } else if (event.key === 'ArrowDown') {
      updatePosition({ ...positions, p1YPosition: positions.p1YPosition + 10 });
    }
  }

  return (
      <canvas tabIndex={0}
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              onKeyDown={handleKeyPress}
      />
  );
};

export default Game;