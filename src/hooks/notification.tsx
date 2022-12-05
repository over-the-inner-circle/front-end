import { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useQueryClient } from '@tanstack/react-query';
import { useSocketRef } from '@/hooks/chat';
import { toast, ToastContentProps } from 'react-toastify';
import { dmHistoryState } from '@/states/dmHistoryState';
import NotificationGame, {GameInvitationData} from '@/molecule/NotificationGame';
import NotificationChat from '@/molecule/NotificationChat';
import NotificationDM from '@/molecule/NotificationDM';
import type { NotificationGameData } from '@/molecule/NotificationGame';
import type { NotificationChatData } from '@/molecule/NotificationChat';
import type { NotificationDMData } from '@/molecule/NotificationDM';
import { currentDMOpponentState } from '@/states/currentDMOpponent';
import {UserInfo} from "@/hooks/user";

interface NotificationResponse<T extends object> {
  type: string;
  data: T;
}

export function useNotification() {
  const socketRef = useSocketRef(`ws://${import.meta.env.VITE_BASE_URL}:1234`);
  const queryClient = useQueryClient();
  const setDmHistory = useSetRecoilState(dmHistoryState);
  const currentOpponent = useRecoilValue(currentDMOpponentState);

  useEffect(() => {
    const socket = socketRef.current;

    const handleGame = ({
      data,
    }: NotificationResponse<GameInvitationData>) => {
      toast(
        (props: ToastContentProps<GameInvitationData>) => (
          <NotificationGame {...props} />
        ),
        {
          autoClose: false,
          toastId: `invite-game-${data.sender.nickname}`,
          data,
        },
      );
    };
    const handleChat = ({
      data,
    }: NotificationResponse<NotificationChatData>) => {
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
    const handleDM = ({ data }: NotificationResponse<NotificationDMData>) => {
      // 최근 DM목록 업데이트
      setDmHistory((currHistory) =>
        currHistory.find(
          (dmInfo) => dmInfo.opponent.user_id === data.sender.user_id,
        )
          ? currHistory
          : [...currHistory, { opponent: data.sender, last_dm: new Date() }],
      );

      if (currentOpponent !== data.sender.nickname) {
        toast(
          (props: ToastContentProps<NotificationDMData>) => (
            <NotificationDM {...props} />
          ),
          {
            data,
          },
        );
      }
    };

    socket.on('notification-game', handleGame);
    socket.on('notification-chat', handleChat);
    socket.on('notification-dm', handleDM);

    return () => {
      socket.off('notification-game', handleGame);
      socket.off('notification-chat', handleChat);
      socket.off('notification-dm', handleDM);
    };
  }, [socketRef, setDmHistory, currentOpponent]);
}
