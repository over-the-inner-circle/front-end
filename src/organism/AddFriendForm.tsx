import { useState } from 'react';
import { fetcher } from '@/hooks/fetcher';

function AddFriendForm() {
  const [query, setQuery] = useState<string>('');
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (query) {
      console.log('request:', query);
      // TODO: response를 받아 사용자에게 요청 결과 알려주기.
      fetcher(`/friend/request/${query}`, { method: 'POST' });
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
