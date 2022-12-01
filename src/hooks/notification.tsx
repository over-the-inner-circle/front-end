import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSocketRef } from '@/hooks/chat';

export function useNotification() {
  const socketRef = useSocketRef(`ws://${import.meta.env.VITE_BASE_URL}:1234`);

  useEffect(() => {
    const socket = socketRef.current;

    const handleGame = (data: any) => {
      const toastId = `invite-game-${data.nickname}`;
      toast.info(
        <div className="flex justify-between font-pixel text-xs">
          <p>Play game with {data.nickname}</p>
          <div className="flex flex-row gap-3">
            <button
              className="text-green-500"
              onClick={() => {
                console.log('play');
                toast.dismiss(toastId);
              }}
            >
              O
            </button>
            <button
              className="text-red-500"
              onClick={() => toast.dismiss(toastId)}
            >
              X
            </button>
          </div>
        </div>,
        {
          autoClose: false,
          toastId,
        },
      );
    };
    const handleChat = (data: unknown) => {
      toast(<div className="font-pixel text-xs">{JSON.stringify(data)}</div>);
    };
    const handleDM = (data: unknown) => {
      toast(<div className="font-pixel text-xs">{JSON.stringify(data)}</div>);
    };

    socket.on('notification-game', handleGame);
    socket.on('notification-chat', handleChat);
    socket.on('notification-dm', handleDM);

    return () => {
      socket.off('notification-game', handleGame);
      socket.off('notification-chat', handleChat);
      socket.off('notification-dm', handleDM);
    };
  }, [socketRef]);
}
