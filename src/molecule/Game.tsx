import React, { useRef, useEffect, useState } from 'react';
import {useSetRecoilState, useRecoilValue, useRecoilState} from "recoil";

import {currentGameScore} from "@/states/game/currentGameScore";
import {currentGameStatus} from "@/states/game/currentGameStatus";
import {gameTheme} from "@/states/game/gameTheme";
import {gameInitialData} from "@/states/game/gameInitialData";
import {gameResult} from "@/states/game/gameResult";

import Pong, { PongComponentsPositions } from "@/models/Pong";
import {GameSocketManager} from "@/models/gameSocket";

interface GameRenderData {
  lPlayerY: number;
  lPlayerScore: number;
  rPlayerY: number;
  rPlayerScore: number;
  ballX: number;
  bally: number;
}

export interface GameResultData {
  "game_id": string,
  "winner": string,
  "game_end": string,
  "game_start": string,
  "difficulty": string,
  "mode": string,
  "l_player": {
    "user_id": string,
    "nickname": string,
    "prof_img": string | null,
    "mmr": number,
    "score": number,
  },
  "r_player": {
    "user_id": string,
    "nickname": string,
    "prof_img": string | null,
    "mmr": number,
    "score": number,
  }
}

const Game = () => {
  const isInitialMount = useRef(true);
  const didGameStarted = useRef(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pongRef = useRef<Pong | null>(null);

  const currentGameTheme = useRecoilValue(gameTheme);
  const initialGameData = useRecoilValue(gameInitialData);

  const [gameScore, setGameScore] = useRecoilState(currentGameScore);
  const setGameResult = useSetRecoilState(gameResult);

  const [gameStatus, setGameStatus] = useRecoilState(currentGameStatus);

  const [positions, setPositions] = useState<PongComponentsPositions | null>(null);


  const socketManager = GameSocketManager.getInstance();

  /* useEffects ================================================================= */

  // 게임 초기화
  useEffect( () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (container && canvas) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }
    const context = canvas?.getContext('2d');
    if (canvas && context && container && initialGameData) {
      pongRef.current = new Pong(context, currentGameTheme, initialGameData);
      setPositions(pongRef.current.currentPositions()); // 포지션 초기화
      setGameScore({ p1Score: 0,  p2Score: 0});
      socketManager.socket?.emit('client_ready_to_start');
    }
  }, []);

  // 포지션 데이터 받아올 때 마다 실행, Pong 객체의 포지션 데이터를 업데이트하고 렌더링
  useEffect(() => {
    // 마운트 시 실행안함
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

    const socket = socketManager.socket;

    if (!socket || !socket.connected) {
      console.log("socket is not connected");
      alert("socket is not connected");
      setGameStatus("INTRO");
      return;
    }

    socket.once('game_started', () => {
      console.log("game_started");
      didGameStarted.current = true;
    });

    socket.on('game_render_data', (data: GameRenderData) => {
      if (!didGameStarted.current) { return; }
      setPositions({
        p1YPosition: data.lPlayerY,
        p2YPosition: data.rPlayerY,
        ballXPosition: data.ballX,
        ballYPosition: data.bally,
      })
      if (data.lPlayerScore !== gameScore.p1Score || data.rPlayerScore !== gameScore.p2Score) {
        setGameScore({ p1Score: data.lPlayerScore, p2Score: data.rPlayerScore });
      }
    });

    socket.once('game_finished', () => {
      // 게임 종료
      console.log("game_finished received");
      socket.emit("save_game_data");
      console.log("game_save_data emitted");
    });

    socket.once('saved_game_data', () => {
      console.log("game_saved_data received");
      socket.emit('user_leave_room');
    });

    socket.once('game_result', (data: GameResultData) => {
      setGameResult(data);
      setGameStatus("FINISHED");
    })

    return () => {
      socket.removeAllListeners('game_started');
      socket.removeAllListeners('game_render_data');
      socket.removeAllListeners('game_finished');
      socket.removeAllListeners('game_saved_data');
      socket.removeAllListeners('game_result');
    }

  }, []);

  /* ============================================================================ */


  /* Event Handlers ============================================================= */

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

    const socket = socketManager.socket;

    if (!socket || !socket.connected || gameStatus !== 'PLAYING') {
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
  }

  /* ========================================================================== */

  /* Render =================================================================== */

  return (
    <div ref={containerRef} className="w-full h-full">
      <canvas tabIndex={0}
        ref={canvasRef}
        onKeyDown={(event) => handleKeyPress(event, 'keyDown')}
        onKeyUp={(event) => handleKeyPress(event, 'keyUp')}
      />
    </div>
  );

};

export default Game;
