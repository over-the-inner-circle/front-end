import React from "react";
import Game from '@/molecule/Game';
import PlayerInfo from "@/molecule/PlayerInfo";
import Spacer from "@/atom/Spacer";

const GameWindow = () => {
  return (
    <>
    <PlayerInfo />
          <div className="flex h-full items-center justify-center">
            <Game />
          </div>
    </>
  );
}

export default GameWindow;