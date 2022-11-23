import Spinner from '@/atom/Spinner';
import { fetcher } from '@/hooks/fetcher';
import { RequestedFriend, useRequestedFriends } from '@/hooks/friends';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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

function useFriendRequestAccept(requestData: RequestedFriend, type?: string) {
  const queryClient = useQueryClient();
  const acceptMutation = useMutation({
    mutationFn: () => {
      return fetcher(`/friend/request/${requestData.request_id}/accept`, {
        method: 'POST',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friend/request', type] });
      queryClient.invalidateQueries({ queryKey: ['friend/all'] });
    },
  });

  return acceptMutation;
}

function useFriendRequestReject(requestData: RequestedFriend, type?: string) {
  const queryClient = useQueryClient();
  const rejectMutation = useMutation({
    mutationFn: (type?: string) => {
      if (type === 'sent') {
        return fetcher(`/friend/request/${requestData.request_id}`, {
          method: 'DELETE',
        });
      }
      return fetcher(`/friend/request/${requestData.request_id}/reject`, {
        method: 'POST',
      });
    },
    onError: () => console.log('reject is failed'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friend/request', type] });
    },
  });

  return rejectMutation;
}

function RequestedFriendItem({ data, type }: RequestedFriendItemProps) {
  const accept = useFriendRequestAccept(data, type);
  const reject = useFriendRequestReject(data, type);

  return (
    <div className="flex flex-row justify-between p-5">
      <p>{data.user_info.nickname}</p>
      <div>
        {type === 'recv' ? (
          <button onClick={() => accept.mutate()}>V</button>
        ) : null}
        <button onClick={() => reject.mutate(type)} className="pl-3">
          X
        </button>
      </div>
    </div>
  );
}

export default RequestedFriendsList;
