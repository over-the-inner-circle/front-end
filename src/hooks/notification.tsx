import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocketRef } from '@/hooks/chat';
import { toast, ToastContentProps } from 'react-toastify';
import NotificationGame from '@/molecule/NotificationGame';
import NotificationChat from '@/molecule/NotificationChat';
import NotificationDM from '@/molecule/NotificationDM';
import type { NotificationGameData } from '@/molecule/NotificationGame';
import type { NotificationChatData } from '@/molecule/NotificationChat';
import type { NotificationDMData } from '@/molecule/NotificationDM';

export function useNotification() {
  const socketRef = useSocketRef(`ws://${import.meta.env.VITE_BASE_URL}:1234`);
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = socketRef.current;

    const handleGame = (data: NotificationGameData) => {
      toast(
        (props: ToastContentProps<NotificationGameData>) => (
          <NotificationGame {...props} />
        ),
        {
          autoClose: false,
          toastId: `invite-game-${data.nickname}`,
          data,
        },
      );
    };
    const handleChat = (data: NotificationChatData) => {
      queryClient.invalidateQueries({ queryKey: ['friend/joined'] });
      toast(
        (props: ToastContentProps<NotificationChatData>) => (
          <NotificationChat {...props} />
        ),
        {
          data,
        },
      );
    };
    const handleDM = (data: NotificationDMData) => {
      // 최근 DM목록 업데이트
      toast(
        (props: ToastContentProps<NotificationDMData>) => (
          <NotificationDM {...props} />
        ),
        {
          data,
        },
      );
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
