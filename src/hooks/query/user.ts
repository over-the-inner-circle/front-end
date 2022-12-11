import { toast } from 'react-toastify';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { accessTokenState, UserInfo } from '@/states/user/auth';
import { refreshAccessToken } from '@/hooks/fetcher';
import { useFetcher } from '@/hooks/fetcher';

export function useCurrentUser() {
  const fetcher = useFetcher();
  const accessToken = useRecoilValue(accessTokenState);
  const data = useQuery<UserInfo>({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await fetcher('/user');
      if (res.ok) return res.json();
      throw res;
    },
    enabled: !!accessToken,
  });
  return data;
}

export function useUserInfo(nickname: string) {
  const fetcher = useFetcher();
  const data = useQuery<UserInfo>({
    queryKey: ['user', nickname],
    queryFn: async () => {
      const res = await fetcher(`/user/${nickname}`);

      if (res.ok) return res.json();
      throw res;
    },
    retry: false,
  });

  return data;
}

interface RefreshData {
  access_token: string;
  refresh_token: string;
}

export function useRefreshToken() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);

  useQuery<RefreshData>({
    queryKey: ['auth/refresh'],
    queryFn: async () => {
      const res = await refreshAccessToken();

      if (res?.ok) return res.json();
      throw res;
    },
    onSuccess: (data) => {
      if (data.access_token) {
        setAccessToken(data.access_token);
        window.localStorage.setItem('refresh_token', data.refresh_token);
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] !== 'auth/refresh',
        });
      } else {
        throw data;
      }
    },
    onError: (err) => {
      if (err instanceof Response) {
        if (err.status === 401) {
          toast.error('session is expired');
          navigate('/');
        }
      }
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 3500 * 1000,
  });

  return accessToken;
}
