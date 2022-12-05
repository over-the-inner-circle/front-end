import {useMutation, useQuery} from '@tanstack/react-query';
import { fetcher } from '@/hooks/fetcher';
import { useNavigate } from 'react-router-dom';
import { f } from 'msw/lib/SetupApi-75fbec12';
import {SignUpUserInfo} from "@/states/user/signUp";
import {toast} from "react-toastify";

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
  const mutation = useMutation({
    mutationFn: async (nickname: string) => {
      const res = await fetcher('/user/nickname', {
        method: 'PUT',
        body: JSON.stringify({ nickname }),
      });
      if (res.ok) return res.json();
      throw res;
    },
    onSuccess: () => {
      toast.success('Your nickname has been updated.');
    },
    onError: (error: Response) => {
      if (error.status === 409) {
        toast.error('Nickname is already taken.');
      } else {
        toast.error('Failed to update nickname.');
      }
    }
  })
  return mutation;
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
