import Spinner from '@/atom/Spinner';
import { fetcher } from '@/hooks/fetcher';
import { RequestedFriend, useRequestedFriends } from '@/hooks/friends';
import { useMutation } from '@tanstack/react-query';
import SectionList from '@/molecule/SectionList';

function RequestedFriendsList() {
  const sentFriends = useRequestedFriends('sent');
  const recvFriends = useRequestedFriends('recv');

  const requestedData = [
    {
      title: 'recv',
      list: recvFriends.data,
    },
    {
      title: 'sent',
      list: sentFriends.data,
    },
  ];

  if (sentFriends.isLoading || recvFriends.isLoading) {
    return <Spinner />;
  }
  if (sentFriends.isError || recvFriends.isError) {
    return null;
  }

  return (
    <SectionList
      sections={requestedData}
      renderItem={(data, type) => (
        <RequestedFriendItem data={data} type={type} />
      )}
      keyExtractor={(data) => data.request_id}
    />
  );
}

interface RequestedFriendItemProps {
  data: RequestedFriend;
  type?: string;
}

function RequestedFriendItem({ data, type }: RequestedFriendItemProps) {
  const accept = useMutation({
    mutationFn: () => {
      return fetcher(`/friend/request/${data.request_id}/accept`, {
        method: 'POST',
      });
    },
  });
  const reject = useMutation({
    mutationFn: (type?: string) => {
      if (type === 'sent') {
        return fetcher(`/friend/request/${data.request_id}`, {
          method: 'DELETE',
        });
      }
      return fetcher(`/friend/request/${data.request_id}/reject`, {
        method: 'POST',
      });
    },
    onError: () => console.log('reject is failed'),
  });

  return (
    <div className="flex flex-row p-5">
      <p>{type === 'sent' ? data.receiver : data.requester}</p>
      {type === 'recv' ? (
        <button onClick={() => accept.mutate()}>V</button>
      ) : null}
      <button onClick={() => reject.mutate(type)} className="pl-3">
        X
      </button>
    </div>
  );
}

export default RequestedFriendsList;
