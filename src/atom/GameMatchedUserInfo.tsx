import Circle from "@/atom/Circle";

export interface MatchedUserInfoProps {
  name: string;
  eloScore: number;
  borderColor: string;
  imgUri: string | null;
  className?: string;
}

const GameMatchedUserInfo = (info: MatchedUserInfoProps) =>
{
  return (
    <div className={`flex flex-col items-center shrink-0 ${info.className} `}>
      <img className={`w-36 h-36 object-fit rounded-full mb-4 border-solid border-8 ${info.borderColor}`}
           src={info.imgUri ? info.imgUri : "src/assets/default_profile_image.png"}
           alt={"user profile"}
      />
      <span>{info.name}</span>
      <span>{info.eloScore}</span>
    </div>
  );
}

export default GameMatchedUserInfo;