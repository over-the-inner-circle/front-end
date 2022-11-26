import DmIcon from '@/atom/DmIcon';
import ChatIcon from '@/atom/ChatIcon';
import FriendIcon from '@/atom/FriendIcon';
import { SidebarItem } from "@/pages/Main";
import CurrentUserWidget from '@/molecule/CurrentUserWidget';

interface NavProps {
  current: string;
  onChange(n: SidebarItem): void;
}

const Nav = ({ current, onChange }: NavProps) => {
  return (
    <div
      className="flex h-[78px] w-full items-center justify-between
                 border-b border-neutral-400 bg-neutral-800"
      id="nav"
    >
      <CurrentUserWidget />
      <div className="flex items-center gap-2">
        <div className="">
          <button onClick={() => onChange('chat')}>
            <ChatIcon isActive={current === 'chat'} />
          </button>
        </div>
        <div className="">
          <button onClick={() => onChange('friend')}>
            <FriendIcon isActive={current === 'friend'} />
          </button>
        </div>
        <div className="">
          <button onClick={() => onChange('dm')}>
            <DmIcon isActive={current === 'dm'} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Nav;
