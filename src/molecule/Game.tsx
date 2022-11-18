import React, { useRef, useEffect, useState } from 'react';
import {useRecoilState, useSetRecoilState} from "recoil";

import Pong, { PongComponentsPositions } from "@/models/Pong";
import {gameSocket} from "@/states/game/gameSocket";
import {currentGameScore} from "@/states/game/currentGameScore";
import {currentGameStatus} from "@/states/game/currentGameStatus";

interface initialGameData {
  width: number;
  height: number;
  playerHeight: number;
  playerWidth: number;
  ballRadius: number;
  lPlayerX: number;
  rPlayerX: number;
}

interface gameRenderData {
  lPlayerY: number;
  lPlayerScore: number;
  rPlayerY: number;
  rPlayerScore: number;
  ballX: number;
  ballY: number;
}

const Game = () => {
  const isInitialMount = useRef(true);
  const didGameStarted = useRef(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pongRef = useRef<Pong | null>(null);

  const [socket, setSocket] = useRecoilState(gameSocket);
  const setGameScore = useSetRecoilState(currentGameScore);
  const setGameStatus = useSetRecoilState(currentGameStatus);

  const [positions, setPositions] = useState<PongComponentsPositions | null>(null);


  /* useEffects ---------------------------------------------------------------*/

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

  // 포지션 데이터 받아올 때 마다 실행, Pong 객체의 포지션 데이터를 업데이트하고 렌더링
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

  // 윈도우 리사이즈 시 게임 크기 조정
  useEffect( () => {
    window.addEventListener('resize', adjustGameSize);
    return () => {
      window.removeEventListener('resize', adjustGameSize);
    }
  }, []);

  // 소켓 리스너
  useEffect( () => {
    if (!socket || !socket.connected) {
      console.log("socket is not connected");
      return;
    }

    socket.once('game_started', (data: initialGameData) => {
      // 게임 최초 데이터 셋업( 난이도 설정에 따른 바 크기 등등...)
      console.log("game_started");
      didGameStarted.current = true;
      //pongRef.current?.updateGameConfig(data);
    });

    socket.once('game_finished', (data: gameRenderData) => {
      // 게임 종료
      console.log("game_finished");
      setGameStatus("FINISHED");
    });

    socket.on('game_render_data', (data: gameRenderData) => {
      if (!didGameStarted.current) { return; }
      setPositions({
        p1YPosition: data.lPlayerY,
        p2YPosition: data.rPlayerY,
        ballXPosition: data.ballX,
        ballYPosition: data.ballY,
      })
      setGameScore({ p1Score: data.lPlayerScore, p2Score: data.rPlayerScore });
    });

  }, []);

  /* -------------------------------------------------------------------------- */


  /* Event Handlers ----------------------------------------------------------- */

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

  const handleKeyPress = (event: React.KeyboardEvent, type: string) => {
    // TODO: 서버에 키보드 입력 쏴주기
    // TODO: keyUP과 keyDown을 구분해서 보내기
    if (!socket || !socket.connected) {
      // 소켓 연결 안되어있으면 에러처리
      return;
    }

    const key = event.key;

    if (key === 'ArrowUp' && type === 'keyDown') {
      socket.emit('up_key_pressed');
    } else if (key === 'ArrowDown' && type === 'keyDown') {
      socket.emit('down_key_pressed');
    } else if (key === 'ArrowUp' && type === 'keyUp') {
      socket.emit('up_key_released');
    } else if (key === 'ArrowDown' && type === 'keyUp') {
      socket.emit('down_key_released');
    }

    // if (event.key === 'ArrowUp' && positions) {
    //   updatePosition({ ...positions, p1YPosition: positions.p1YPosition - 10 });
    // } else if (event.key === 'ArrowDown' && positions) {
    //   updatePosition({ ...positions, p1YPosition: positions.p1YPosition + 10 });
    // }
  }

  /* -------------------------------------------------------------------------- */

  /* Render ------------------------------------------------------------------- */

  return (
    <div ref={containerRef} className="w-full h-full">
      <canvas tabIndex={0}
        ref={canvasRef}
        onKeyDown={(event) => handleKeyPress(event, 'keyDown')}
        onKeyUp={(event) => handleKeyPress(event, 'keyUp')}
        />
    </div>
  );

  /* -------------------------------------------------------------------------- */
};

// const socketUri = (): string => {
//   const requestUri = import.meta.env.VITE_REQUEST_URL;
//   // TODO: 소켓 요청하기
//   // const soketUri = fetch(requestUri) {
//   //
//   // }
//   const socketUri = '';
//   return socketUri;
// }

export default Game;
