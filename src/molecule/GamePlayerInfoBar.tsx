import Circle from "@/atom/Circle"
import Spacer from "@/atom/Spacer"

const GamePlayerInfo = () => {
	return (
		<>
		<div className="flex flex-row bg-neutral-800 font-pixel text-white">
			<div className="flex my-6 ml-6">
				<Circle radius={32.5} className="fill-yellow-300" />
				<div className="flex flex-col ml-4 items-start justify-center">
				<span>UserName</span>
				<span>RankScore</span>
				</div>
			</div>
			<Spacer />
			<div className="flex flex-col text-4xl whitespace-nowrap justify-center stop-dragging">4   :   2</div>
			<Spacer />
			<div className="flex my-6 mr-6">
				<div className="flex flex-col mr-4 items-end justify-center">
				<span>UserName</span>
				<span>RankScore</span>
				</div>
				<Circle radius={32.5} className="fill-yellow-300" />
			</div>
		</div>
		<div className="bg-white w-full h-4"></div>
		</>
	)
}

export default GamePlayerInfo