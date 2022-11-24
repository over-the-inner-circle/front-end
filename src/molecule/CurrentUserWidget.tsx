import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/hooks/fetcher';

interface UserInfo {
  user_id: string;
  nickname: string;
  provider: string;
  third_party_id: string;
  prof_img: string;
  mmr: number;
  two_factor_authentication_type?: string;
  two_factor_authentication_key?: string;
  created: Date;
  deleted?: Date;
}

function useCurrentUser() {
  const data = useQuery<UserInfo>({
    queryKey: ['/user'],
    queryFn: async () => {
      const res = await fetcher('/user');

      if (res.ok) return res.json();
      throw res;
    },
  });
  return data;
}

function CurrentUserWidget() {
  const { data, isLoading, isError } = useCurrentUser();

  // render skeleton ui
  if (isLoading) return <div />;
  if (isError) return <div />;

  return (
    <div className="px-2 font-pixel text-sm text-white">
      <button
        className="flex flex-row items-center gap-2 p-1 rounded-sm
                   hover:bg-neutral-700
                   focus:outline-none focus:ring focus:ring-slate-100"
      >
        <div className="m-1 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
          <img
            src={data.prof_img}
            alt="profile"
            className="h-full w-full object-cover"
          />
        </div>
        <p className="mr-1">{data.nickname}</p>
      </button>
    </div>
  );
}

export default CurrentUserWidget;
