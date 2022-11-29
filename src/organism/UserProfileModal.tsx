import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
} from '@floating-ui/react-dom-interactions';
import Spinner from '@/atom/Spinner';
import { fetcher } from '@/hooks/fetcher';
import { UserInfo } from '@/hooks/user';
import { profileUserState } from '@/states/user/profileUser';

function UserProfileModal() {
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

  return (
    <FloatingPortal>
      {open && profileUser && (
        <FloatingOverlay
          lockScroll
          className="flex items-center justify-center bg-neutral-800/80"
        >
          <FloatingFocusManager context={context}>
            <div className="h-3/4 w-2/3" ref={floating} {...getFloatingProps()}>
              <UserProfile
                nickname={profileUser}
                close={() => setOpen(false)}
              />
            </div>
          </FloatingFocusManager>
        </FloatingOverlay>
      )}
    </FloatingPortal>
  );
}

function useUserInfo(nickname: string) {
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

interface UserProfileProps {
  nickname: string;
  close(): void;
}

function UserProfile({ nickname, close }: UserProfileProps) {
  const { data, isError, isLoading } = useUserInfo(nickname);

  return (
    <div
      className="flex h-full w-full flex-col flex-wrap items-center justify-start
                 border-4 bg-neutral-900 p-4 font-pixel text-white"
    >
      <div className="flex w-full items-start">
        <button onClick={close}>X</button>
      </div>
      <div className="flex w-full max-w-md flex-col space-y-6 pt-8">
        {isError ? (
          <h2>Could not found {`'${nickname}'`}</h2>
        ) : isLoading ? (
          <Spinner />
        ) : (
          <>
            <div className="flex flex-row items-center">
              <div className="m-1 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full">
                <img
                  src={data.prof_img}
                  alt="profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col space-y-2 pl-5">
                <p className="text-2xl">{data.nickname}</p>
                <p>mmr: {data.mmr}</p>
              </div>
            </div>
            <div>최근 전적</div>
          </>
        )}
      </div>
    </div>
  );
}

export default UserProfileModal;
