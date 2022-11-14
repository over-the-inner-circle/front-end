import React from "react";
import GameWindow from '@/organism/GameWindow';

const GameContainer = () => {
  return (
    <div className="flex flex-col h-full w-full bg-neutral-900">
      <GameWindow />
    </div>
  );
}

export default GameContainer;
