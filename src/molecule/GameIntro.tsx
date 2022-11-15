import Button from "@/atom/Button";

const GameIntro = () => {

  return(
    <div className="flex h-full w-full items-center justify-center bg-neutral-700">
      <Button className="bg-green-600 text-white font-pixel text-2xl drop-shadow-xl">
        Start Game
      </Button>
    </div>
  );
}

export default GameIntro