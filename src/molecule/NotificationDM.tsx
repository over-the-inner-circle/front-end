import { useSetRecoilState } from 'recoil';
import { currentSideBarItemState } from '@/states/currentSideBarItemState';
import { dmHistoryState } from '@/states/dmHistoryState';
import type { ToastContentProps } from 'react-toastify';
import type { Friend } from '@/hooks/friends';

export interface NotificationDMData {
  sender: Friend;
  payload: string;
}

function NotificationDM({
  data,
  closeToast,
}: ToastContentProps<NotificationDMData>) {
  const setCurrentSideBarItem = useSetRecoilState(currentSideBarItemState);
  const setDmHistory = useSetRecoilState(dmHistoryState);

  const handleClick = () => {
    if (data?.sender) {
      setCurrentSideBarItem('dm');
      setDmHistory((currHistory) =>
        currHistory.find(
          (dmInfo) => dmInfo.opponent.user_id === data.sender.user_id,
        )
          ? currHistory
          : [...currHistory, { opponent: data.sender, last_dm: new Date() }],
      );
    }
    if (closeToast) closeToast();
  };

  return (
    <button
      className="flex w-full flex-col items-start justify-center whitespace-nowrap"
      onClick={handleClick}
    >
      <p>
        <strong>{data?.sender.nickname ?? '???'}</strong>: {data?.payload}
      </p>
    </button>
  );
}

export default NotificationDM;
