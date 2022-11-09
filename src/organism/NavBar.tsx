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
      className="flex flex-row justify-between items-center
                 font-pixel text-white text-sm bg-neutral-900
                 w-full h-16 px-5
                 border-b border-neutral-400"
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
