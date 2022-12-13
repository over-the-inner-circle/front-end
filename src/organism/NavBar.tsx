import DmIcon from '@/atom/DmIcon';
import FriendIcon from '@/atom/FriendIcon';
import ChatIcon from '@/atom/ChatIcon';

interface User {
  name: string;
  profUrl: string;
}

export type SidebarItem = 'dm' | 'friend' | 'chat';

interface NavBarProps extends React.HTMLAttributes<HTMLDivElement> {
  user: User;
  sidebarIndex: SidebarItem;
  setSidebarIndex(i: SidebarItem): void;
  toggleProfilePopup(): void;
}

export default function NavBar({
  user,
  sidebarIndex = 'friend',
  setSidebarIndex,
  toggleProfilePopup,
}: NavBarProps) {
  const sidebarItems: Array<{
    id: SidebarItem;
    Icon(props: { isActive?: boolean }): React.ReactElement;
  }> = [
    { id: 'dm', Icon: DmIcon },
    { id: 'friend', Icon: FriendIcon },
    { id: 'chat', Icon: ChatIcon },
  ];

  return (
    <div
      className="flex h-16 w-full flex-row
                 items-center justify-between border-b border-neutral-400
                 bg-neutral-900 px-5 font-pixel
                 text-sm text-white"
    >
      <button
        className="flex flex-row items-center gap-2 p-1
                   hover:bg-neutral-600
                   focus:outline-none focus:ring focus:ring-slate-100"
        onClick={toggleProfilePopup}
      >
        <img src={user.profUrl} alt="profile" className="rounded-full p-1" />
        <p>{user.name}</p>
        <p>^</p>
      </button>
      <ul id="sidebar-tab" className="flex flex-row items-center">
        {sidebarItems.map(({ id, Icon }) => (
          <li key={id}>
            <button onClick={() => setSidebarIndex(id)}>
              <Icon isActive={sidebarIndex === id} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
