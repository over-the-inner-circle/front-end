import { useSetRecoilState } from 'recoil';
import { currentSideBarItemState } from '@/states/currentSideBarItemState';
import { currentDMOpponentState } from '@/states/currentDMOpponent';
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
  const setCurrentDMOpponent = useSetRecoilState(currentDMOpponentState);

  const handleClick = () => {
    if (data?.sender) {
      setCurrentSideBarItem('dm');
      setCurrentDMOpponent(data.sender.nickname);
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
