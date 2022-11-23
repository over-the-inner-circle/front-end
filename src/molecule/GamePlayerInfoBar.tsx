import Circle from "@/atom/Circle"
import Spacer from "@/atom/Spacer"

import {useRecoilValue} from "recoil";

import {currentGameScore} from "@/states/game/currentGameScore";
import {matchInfo} from "@/states/game/matchInfo";

const GamePlayerInfoBar = () => {

	const gameScore = useRecoilValue(currentGameScore);
	const playerInfo = useRecoilValue(matchInfo);

	if (!playerInfo) {
		return null;
	}
	return (
		<>
		<div className="flex flex-row bg-neutral-800 font-pixel text-white">
			<div className="flex my-6 ml-6">
				<Circle radius={32.5} className="fill-yellow-300" />
				<div className="flex flex-col ml-4 items-start justify-center">
				<span>{playerInfo.lPlayerInfo.nickname}</span>
				<span>{playerInfo.lPlayerInfo.mmr}</span>
				</div>
			</div>
			<Spacer />
			<div className="flex flex-col text-4xl whitespace-nowrap justify-center stop-dragging">
				{gameScore ? gameScore.p1Score : 0}   :   {gameScore ? gameScore.p2Score : 0}
			</div>
			<Spacer />
			<div className="flex my-6 mr-6">
				<div className="flex flex-col mr-4 items-end justify-center">
				<span>{playerInfo.rPlayerInfo.nickname}</span>
				<span>{playerInfo.rPlayerInfo.mmr}</span>
				</div>
				<Circle radius={32.5} className="fill-yellow-300" />
			</div>
		</div>
		<div className="bg-white w-full h-4"></div>
		</>
	)
}

export default GamePlayerInfoBar