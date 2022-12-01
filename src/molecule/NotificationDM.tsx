import { useSetRecoilState } from 'recoil';
import { currentSideBarItemState } from '@/states/currentSideBarItemState';
import type { ToastContentProps } from 'react-toastify';

export interface NotificationDMData {
  sender: string;
  payload: string;
}

function NotificationDM({
  data,
  closeToast,
}: ToastContentProps<NotificationDMData>) {
  const setCurrentSideBarItem = useSetRecoilState(currentSideBarItemState);

  const handleClick = () => {
    setCurrentSideBarItem('dm');
    if (closeToast) closeToast();
  };

  return (
    <button
      className="flex w-full flex-col items-start justify-center whitespace-nowrap"
      onClick={handleClick}
    >
      <p>
        <strong>{data?.sender ?? '???'}</strong>: {data?.payload}
      </p>
    </button>
  );
}

export default NotificationDM;
