import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/hooks/fetcher';
import { useNavigate } from 'react-router-dom';
import { f } from 'msw/lib/SetupApi-75fbec12';

export interface UserInfo {
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

export function useCurrentUser() {
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

export function useUpdateUserName() {

}

export function useUpdateUserProfilePhoto() {

}

export function useUpdateUser2Fa() {
  
}

export function useLogOut() {
  const navigate = useNavigate();

  const logOut = () => {
    window.localStorage.removeItem('access_token');
    window.localStorage.removeItem('refresh_token');
    navigate('/');
  };

  return logOut;
}
