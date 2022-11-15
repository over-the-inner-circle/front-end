import Button from "@/atom/Button";

const GameOnMatching = () => {

  const cancelMatching = () => {
    console.log("cancel matching");
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full stop-dragging">
      <span className="text-white font-pixel text-2xl"> Matching... </span>
      <Button onClick={cancelMatching}
              className="bg-red-500 text-white font-pixel mt-10">
                cancel
      </Button>
    </div>
  )
}

export default GameOnMatching;