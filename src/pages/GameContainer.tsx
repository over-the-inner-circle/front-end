import React from "react";
import GameWindow from '@/organism/GameWindow';
import GameOnMatching from "@/molecule/GameOnMatching";
import GameMatched from "@/molecule/GameMatched";
import GameIntro from "@/molecule/GameIntro";

const GameContainer = () => {
  return (
    <div className="flex flex-col h-full w-full bg-neutral-900">
      <GameIntro />
      {/*<GameMatched />*/}
      {/*<GameOnMatching />*/}
      {/* <GameWindow /> */}
    </div>
  );
}

export default GameContainer;
