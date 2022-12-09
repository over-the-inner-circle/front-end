import { useState } from 'react';
import { useFetcher } from '@/hooks/fetcher';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

function useAddFriend() {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();
  const mutation = useMutation({
    mutationFn: async (nickname: string) => {
      const res = await fetcher(`/friend/request/${nickname}`, {
        method: 'POST',
      });
      if (res.ok) return res;
      throw res;
    },
    onSuccess: (_, nickname) => {
      queryClient.invalidateQueries({ queryKey: ['friend/request', 'sent'] });
      toast.success(`sent friend request to ${nickname}`);
    },
    onError: (error, nickname) => {
      let errorMsg = `friend request to ${nickname} failed`;

      if (error instanceof Response) {
        if (error.status === 404) {
          errorMsg = `could not found ${nickname}`;
        }
      }
      toast.error(errorMsg);
    },
  });
  return mutation;
}

function AddFriendForm() {
  const [query, setQuery] = useState<string>('');
  const addFriend = useAddFriend();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (query) {
      addFriend.mutate(query);
      setQuery('');
    }
  };

  return (
    <form
      className="flex h-16 w-full shrink-0 flex-row items-center border-b border-neutral-400 bg-neutral-800"
      onSubmit={handleSubmit}
    >
      <button className="px-2" type="submit">
        +
      </button>
      <div className="flex h-full w-min items-center bg-neutral-800">
        <input
          className=" w-min border-b-4 border-white bg-inherit"
          name="q"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </form>
  );
}

export default AddFriendForm;
