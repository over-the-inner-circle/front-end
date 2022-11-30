import { profileUserState } from '@/states/user/profileUser';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';

function SearchUserProfileForm() {
  const [query, setQuery] = useState('');
  const setProfileUser = useSetRecoilState(profileUserState);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query) {
      setProfileUser(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="font-pixel text-sm text-white border-b w-40 flex">
      <button type="submit">@</button>
      <input
        type="search"
        placeholder="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-inherit p-2 w-full"
      />
    </form>
  );
}

export default SearchUserProfileForm;
