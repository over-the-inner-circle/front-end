import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useLogOut } from '@/hooks/user';
import { useOptionMenu } from '@/hooks/optionMenu';
import OptionMenu, { Option } from '@/molecule/OptionMenu';
import { profileUserState } from '@/states/user/profileUser';
import isEditAccountModalOpenState from "@/states/user/isEditAccountModalOpen";
import { currentUserInfoState, UserInfo } from '@/states/user/auth';
import Button from '@/atom/Button';

function CurrentUserWidget() {
  const data = useRecoilValue(currentUserInfoState);
  const {
    open,
    setOpen,
    reference,
    floating,
    getReferenceProps,
    getFloatingProps,
    x,
    y,
    strategy,
  } = useOptionMenu();
  const logOut = useLogOut();

  if (!data) {
    return (
      <Button onClick={logOut} className="bg-red-700">
        Sign in
      </Button>
    );
  }

  return (
    <div className="px-2 font-pixel text-sm text-white">
      <button
        ref={reference}
        {...getReferenceProps()}
        className="flex flex-row items-center gap-2 rounded-sm p-1
                   hover:bg-neutral-700
                   focus:outline-none focus:ring focus:ring-slate-100"
      >
        <div className="m-1 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
          <img
            src={data.prof_img}
            alt="profile"
            className="h-full w-full object-cover"
          />
        </div>
        <p className="mr-1">{data.nickname}</p>
      </button>
      {open && (
        <div
          ref={floating}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            width: 'max-content',
          }}
          onClick={() => setOpen(false)}
          {...getFloatingProps()}
        >
          <UserOptionMenu currentUser={data} />
        </div>
      )}
    </div>
  );
}

interface OptionMenuProps {
  currentUser: UserInfo;
}

function UserOptionMenu({ currentUser }: OptionMenuProps) {
  const logOut = useLogOut();
  const setProfileUser = useSetRecoilState(profileUserState);
  const setIsEditModalOpen = useSetRecoilState(isEditAccountModalOpenState);

  const options: Option[] = [
    {
      label: 'My Profile',
      onClick: () => {
        setProfileUser(currentUser.nickname);
      },
    },
    {
      label: 'Edit Account',
      onClick: () => {
        setIsEditModalOpen(true);
      },
    },
    {
      label: 'Log Out',
      color: 'text-red-700',
      onClick: () => {
        logOut();
      },
    },
  ];
  return <OptionMenu options={options} />;
}

export default CurrentUserWidget;
