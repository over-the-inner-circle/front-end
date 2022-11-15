import Circle from "@/atom/Circle";

export interface MatchedUserInfoProps {
  name: string;
  eloScore: string;
  imgUri: string;
  className: string;
}

const GameMatchedUserInfo = ({ info } : { info: MatchedUserInfoProps}) =>
{
  return (
    <div className={`flex flex-col items-center ${info.className}`}>
      <Circle radius={72} className={"fill-white mb-4"}></Circle>
      <span>{info.name}</span>
      <span>{info.eloScore}</span>
    </div>
  );
}

export default GameMatchedUserInfo;