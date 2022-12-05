import { useQuery, useQueryClient } from '@tanstack/react-query';
import { refreshAccessToken, useFetcher } from '@/hooks/fetcher';
import { useNavigate } from 'react-router-dom';
import { accessTokenState, UserInfo } from '@/states/user/auth';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { toast } from 'react-toastify';

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
    enabled: !accessToken,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 3500 * 1000,
  });

  return accessToken;
}

export function useCurrentUser() {
  const fetcher = useFetcher();
  const data = useQuery<UserInfo>({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await fetcher('/user');

      if (res.ok) return res.json();
      throw res;
    },
  });
  return data;
}

export function useLogOut() {
  const navigate = useNavigate();
  const setAccessToken = useSetRecoilState(accessTokenState);

  const logOut = () => {
    setAccessToken(null);
    window.localStorage.removeItem('refresh_token');
    navigate('/');
  };

  return logOut;
}
