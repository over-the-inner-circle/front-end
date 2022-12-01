import { RoomInfo } from '@/states/roomInfoState';
import { ToastContentProps } from 'react-toastify';

export interface NotificationChatData {
  roomInfo: RoomInfo;
}

function NotificationGame({
  data,
  closeToast,
}: ToastContentProps<NotificationChatData>) {
  const handleClick = () => {
    // 채팅 화면으로 이동
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

export default NotificationGame;
