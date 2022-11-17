import { useState } from 'react';
import SideBarLayout from '@/molecule/SideBarLayout';
import FriendsList from './FriendsList'
import RequestedFriendsList from './RequestedFriendsList';
import AddFriendForm from './AddFriendForm';

function Friends() {
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
  const [isOpenRequest, setIsOpenRequest] = useState<boolean>(false);

  return (
    <SideBarLayout>
      <div className="flex h-12 w-full shrink-0 flex-row items-center justify-between border-b border-neutral-400 bg-neutral-800 px-5">
        <button
          className="flex flex-row items-center justify-start"
          onClick={() => setIsOpenForm(!isOpenForm)}
        >
          <p className="text-lg">Friends</p>
          <p className="px-1">{isOpenForm ? 'x' : '+'}</p>
        </button>
        <button onClick={() => setIsOpenRequest(!isOpenRequest)}>
          {isOpenRequest ? 'x' : '?'}
        </button>
      </div>
      {isOpenForm ? <AddFriendForm /> : null}
      {isOpenRequest ? <RequestedFriendsList /> : <FriendsList />}
    </SideBarLayout>
  );
}

export default Friends;
