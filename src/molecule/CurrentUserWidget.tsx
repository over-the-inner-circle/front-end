import { useCurrentUser, useLogOut, UserInfo } from '@/hooks/user';
import { useOptionMenu } from '@/hooks/optionMenu';
import OptionMenu, { Option } from '@/molecule/OptionMenu';

function CurrentUserWidget() {
  const { data, isLoading, isError } = useCurrentUser();
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

  // render skeleton ui
  if (isLoading) return <div />;
  if (isError) return <div />;

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

  const options: Option[] = [
    {
      label: 'My Profile',
      onClick: () => {
        console.log(currentUser.nickname);
      },
    },
    {
      label: 'Edit Account',
      onClick: () => {
        /**/
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
