import Button from '@/atom/Button';
import type { ToastContentProps } from 'react-toastify';

export interface NotificationGameData {
  nickname: string;
  gameId: string;
}

function NotificationGame({
  data,
  closeToast,
}: ToastContentProps<NotificationGameData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col items-start justify-start whitespace-nowrap pr-3">
        <h2 className="text-sm">Invited Game</h2>
        <p>{data?.nickname}</p>
      </div>
      <Button
        className="break-keep bg-green-500 text-xs"
        onClick={() => {
          console.log(data?.gameId);
          if (closeToast) closeToast();
        }}
      >
        Play
      </Button>
    </div>
  );
}

export default NotificationGame;
