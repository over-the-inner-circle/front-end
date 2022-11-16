import React, { useRef, useEffect, useState } from 'react';
import Pong, { PongComponentsPositions } from "@/models/Pong";
import useSocket from "@/hooks/useSocket";

const socketUri = (): string => {
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

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pongRef = useRef<Pong | null>(null);
  const socket = useSocket(socketUri());

  const [positions, setPositions] = useState<PongComponentsPositions | null>(null);

  // 퐁 초기화
  useEffect( () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (container && canvas) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }
    const context = canvas?.getContext('2d');
    if (canvas && context && container) {
      pongRef.current = new Pong(context);
      setPositions(pongRef.current.currentPositions()); // 포지션 초기화
    }
  }, []);

  // 윈도우 리사이즈 시 게임 크기 조정
  useEffect( () => {
    window.addEventListener('resize', adjustGameSize);
    return () => {
      window.removeEventListener('resize', adjustGameSize);
    }
  }, []);

  useEffect(() => {
    // 마운트 시 실행안함
    console.log(pongRef.current);
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (pongRef.current && positions) {
        pongRef.current.updateCurrentPositions(positions);
        pongRef.current.render();
      }
    }
  }, [positions]);

  const adjustGameSize = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (container && canvas) {
      canvas.height = container.clientHeight
      canvas.width = container.clientWidth
    }
    pongRef.current?.adjustAfterResize();
    pongRef.current?.render();
  }

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



    
    if (event.key === 'ArrowUp' && positions) {
      updatePosition({ ...positions, p1YPosition: positions.p1YPosition - 10 });
    } else if (event.key === 'ArrowDown' && positions) {
      updatePosition({ ...positions, p1YPosition: positions.p1YPosition + 10 });
    }
  }

  return (
    <div ref={containerRef} className="w-full h-full">
        
      <canvas tabIndex={0}
        ref={canvasRef}
        onKeyDown={handleKeyPress}
        />
    </div>
  );
};

export default Game;
