import { useState } from 'react';
import SideBarLayout from '@/molecule/SideBarLayout';
import SideBarHeader from '@/molecule/SideBarHeader';
import FriendsList from './FriendsList';
import RequestedFriendsList from './RequestedFriendsList';
import AddFriendForm from './AddFriendForm';

function Friends() {
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
  const [isOpenRequest, setIsOpenRequest] = useState<boolean>(false);

  return (
    <SideBarLayout>
      <SideBarHeader>
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
      </SideBarHeader>
      {isOpenForm ? <AddFriendForm /> : null}
      {isOpenRequest ? <RequestedFriendsList /> : <FriendsList />}
    </SideBarLayout>
  );
}

export default Friends;
