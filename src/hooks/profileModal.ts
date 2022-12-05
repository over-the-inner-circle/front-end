import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { profileUserState } from '@/states/user/profileUser';
import {
  useDismiss,
  useFloating,
  useInteractions,
} from '@floating-ui/react-dom-interactions';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from './fetcher';
import { UserInfo } from './user';

export function useProfileModal() {
  const [profileUser, setProfileUser] = useRecoilState(profileUserState);
  const [open, setOpen] = useState(false);
  const { floating, context } = useFloating({
    open,
    onOpenChange: setOpen,
  });

  const dismiss = useDismiss(context);
  const { getFloatingProps } = useInteractions([dismiss]);

  useEffect(() => {
    if (profileUser) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [profileUser]);

  useEffect(() => {
    if (!open) {
      setProfileUser(null);
    }
  }, [open, setProfileUser]);

  return { profileUser, open, setOpen, context, floating, getFloatingProps };
}

export function useUserInfo(nickname: string) {
  const data = useQuery<UserInfo>({
    queryKey: ['user', nickname],
    queryFn: async () => {
      const res = await fetcher(`/user/${nickname}`);

      if (res.ok) return res.json();
      throw res;
    },
    retry: false,
  });

  return data;
}
