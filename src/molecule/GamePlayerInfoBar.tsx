import {useRecoilState, useRecoilValue} from "recoil";

import {currentGameScore} from "@/states/game/currentGameScore";
import {matchInfo} from "@/states/game/matchInfo";
import {currentGameStatus} from "@/states/game/currentGameStatus";

import Button from "@/atom/Button";
import Spacer from "@/atom/Spacer"


const GamePlayerInfoBar = () => {

	const gameScore = useRecoilValue(currentGameScore);
	const playerInfo = useRecoilValue(matchInfo);
	const [gameStatus, setGameStatus] = useRecoilState(currentGameStatus);

	const lPlayerProfileImg = playerInfo?.lPlayerInfo.prof_img;
	const rPlayerProfileImg = playerInfo?.rPlayerInfo.prof_img;

	/* sub components =========================================================== */

	const LeftPlayerInfo = () => {
		if (!playerInfo) {
			return null;
		}
		return (
			<div className="flex my-6 ml-6">
				<img className={`shrink-0 w-14 h-14 rounded-full shrink-0`}
						 src={lPlayerProfileImg ? lPlayerProfileImg : "src/assets/default_profile_image.png"}
						 alt={"user profile"}
				/>
				<div className="flex flex-col ml-4 items-start justify-center">
					<span>{playerInfo.lPlayerInfo.nickname}</span>
					<span>{playerInfo.lPlayerInfo.mmr}</span>
				</div>
			</div>
		)
	}

	const RightPlayerInfo = () => {
		if (!playerInfo) {
			return null;
		}
		return (
			<div className="flex my-6 mr-6 justify-center items-center">
				<div className="flex flex-col mr-4 items-end justify-center">
					<span>{playerInfo.rPlayerInfo.nickname}</span>
					<span>{playerInfo.rPlayerInfo.mmr}</span>
				</div>
				<img className={`shrink-0 w-14 h-14 rounded-full shrink-0`}
						 src={rPlayerProfileImg ? rPlayerProfileImg : "src/assets/default_profile_image.png"}
						 alt={"user profile"}
				/>
			</div>
		)
	}

	const ScoreBoard = () => {
		return (
			<div className="flex flex-col text-4xl whitespace-nowrap justify-center stop-dragging">
				{gameScore ? gameScore.p1Score : 0}   :   {gameScore ? gameScore.p2Score : 0}
			</div>
		)
	}

  /* ========================================================================== */

	/* render =================================================================== */

	return (
		<div className="flex flex-col">
			<div className="flex flex-row bg-neutral-800 font-pixel text-white">
				<LeftPlayerInfo />
				<Spacer />
				<ScoreBoard />
				<Spacer />
				<RightPlayerInfo />
			</div>
			<div className="bg-white w-full h-4"></div>
		</div>
	)
}

export default GamePlayerInfoBar