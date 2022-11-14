import React from "react";
import Game from '@/molecule/Game';
import PlayerInfo from "@/molecule/PlayerInfo";
import Spacer from "@/atom/Spacer";

const GameWindow = () => {
  return (
    <>
    <PlayerInfo />
    <div className="flex h-full justify-center items-center">
        <Game />
    </div>
    </>
  );
}

export default GameWindow;