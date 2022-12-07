import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {refreshAccessToken, useFetcher} from '@/hooks/fetcher';
import { useNavigate } from 'react-router-dom';
import { accessTokenState, UserInfo } from '@/states/user/auth';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import { toast } from 'react-toastify';
import {signUpUserInfoState} from "@/states/user/signUp";
import {useEffect} from "react";
import {getOAuthUrl, providers} from "@/pages/Intro";

interface RefreshData {
  access_token: string;
  refresh_token: string;
}

export interface TwoFAGenerateData {
  "otpauthUrl": string;
  "secret": string;
}

export const useSignUpUser = () => {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const signUpUserInfo = useRecoilValue(signUpUserInfoState);

  useEffect(() => {
    if (!signUpUserInfo) {
      navigate('/');
    }
  }, [signUpUserInfo, navigate]);

  const mutation = useMutation({
    mutationFn: async (nickname: string) => {
      await fetcher('/user', {
        method: 'POST',
        body: JSON.stringify({
          nickname,
          provider: signUpUserInfo?.provider,
          third_party_id: signUpUserInfo?.third_party_id,
          prof_img: signUpUserInfo?.prof_img,
        })
      });
    },
    onSuccess: () => {
      if (signUpUserInfo) {
        window.location.href = getOAuthUrl(providers[signUpUserInfo.provider]);
      }
    },
    onError: (error: Response) => {
      if (error.status === 409) {
        toast.error('Nickname is already exist');
      } else {
        toast.error('Something went wrong');
        console.log(error);
      }
    }
  })
  return mutation;
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

export function useUpdateUserName() {
  const fetcher = useFetcher();
  const queryClient = useQueryClient();
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
      queryClient.invalidateQueries({queryKey: ['auth/refresh']});
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

export function useUpdateUserProfileImage() {
  const fetcher = useFetcher();
  const mutation = useMutation({
    mutationFn: async (image: File) => {
      const imgData = new FormData();
      imgData.append('prof_img', image);
      const res = await fetcher('/user/prof-img', {
        method: 'PUT',
        body: imgData,
      }, '');
      if (res.ok) return res.json();
      throw res;
    },
    onSuccess: () => {
      toast.success('Your profile image has been updated.');
    },
    onError: () => {
      toast.error('Failed to update profile image.');
    }
  })
  return mutation;
}

export function useGenerateUser2FA() {
  const fetcher = useFetcher();
  const data = useQuery<TwoFAGenerateData>({
    queryKey: ['auth/2fa/generate'],
    queryFn: async () => {
      const res = await fetcher('/auth/2fa/generate');
      if (res.ok) return res.json();
      throw res;
    },
  });
  return data;
}

export function useUpdateUser2Fa() {

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

export const useDeleteAccount = () => {
  const fetcher = useFetcher();
  const logOut = useLogOut();
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetcher('/user', {
        method: 'DELETE',
      });
      if (res.ok) return res.json();
      throw res;
    },
    onSuccess: () => {
      logOut();
      toast.success('Your account has been deleted.');
    },
    onError: (error: Response) => {
      console.log(error);
      toast.error('Failed to delete account.');
    }
  })
  return mutation;
}