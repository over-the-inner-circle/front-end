import { useSetRecoilState } from 'recoil';
import { currentSideBarItemState } from '@/states/currentSideBarItemState';
import type { ToastContentProps } from 'react-toastify';
import type { RoomInfo } from '@/states/roomInfoState';

export interface NotificationChatData {
  roomInfo: RoomInfo;
}

function NotificationChat({
  data,
  closeToast,
}: ToastContentProps<NotificationChatData>) {
  const setCurrentSideBarItem = useSetRecoilState(currentSideBarItemState);

  const handleClick = () => {
    setCurrentSideBarItem('chat');
    if (closeToast) closeToast();
  };

  return (
    <button className="flex items-center justify-between" onClick={handleClick}>
      <div className="flex flex-col items-start justify-start whitespace-nowrap pr-3">
        <h2 className="text-sm">Invited to the Chat</h2>
        <p>{data?.roomInfo.room_name}</p>
      </div>
    </button>
  );
}

export default NotificationChat;
