import {
  HistoryUser,
  MatchHistory,
  useMatchHistory,
} from '@/hooks/matchHistory';

interface UserMatchHistoryProps {
  nickname: string;
}

function getPlayTime(matchInfo: MatchHistory) {
  const sec =
    (Date.parse(matchInfo.game_end) - Date.parse(matchInfo.game_start)) / 1000;

  return `${Math.floor(sec / 60)
    .toString()
    .padStart(2, '0')}:${(sec % 60).toString().padStart(2, '0')}`;
}

function UserMatchHistory({ nickname }: UserMatchHistoryProps) {
  const { data: history, isError, isLoading } = useMatchHistory(nickname);

  if (isError || isLoading) return null;

  return (
    <>
      <div>최근 전적</div>
      <ul className="w-full">
        {history.map((matchInfo) => (
          <li key={matchInfo.game_id} className="flex w-full flex-col pb-8">
            <div className="flex w-full flex-row gap-3 text-xs">
              <p>{new Date(matchInfo.game_start).toLocaleDateString()}</p>
              <p>({getPlayTime(matchInfo)})</p>
            </div>
            <div className="flex flex-row items-center justify-center py-3">
              <div className="flex w-full flex-row items-center justify-between">
                <UserLabel
                  user={matchInfo.l_player}
                  winner={matchInfo.winner}
                  isLeft={true}
                />
                <p className="flex w-14 items-center justify-end pr-5 text-2xl">
                  {matchInfo.l_player.score}
                </p>
              </div>
              <p className="flex items-center justify-center">:</p>
              <div className="flex w-full flex-row items-center justify-between">
                <p className="flex w-14 items-center justify-start pl-5 text-2xl">
                  {matchInfo.r_player.score}
                </p>
                <UserLabel
                  user={matchInfo.r_player}
                  winner={matchInfo.winner}
                  isLeft={false}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

interface UserLabelProps {
  user: HistoryUser;
  winner: string;
  isLeft: boolean;
}

function UserLabel({ user, winner, isLeft }: UserLabelProps) {
  return (
    <div
      className={`flex flex-col justify-center ${
        isLeft ? 'items-start' : 'items-end'
      }`}
    >
      <p>{user.nickname}</p>
      <p className="text-xs">{winner === user.nickname ? 'win' : 'lose'}</p>
    </div>
  );
}

export default UserMatchHistory;
