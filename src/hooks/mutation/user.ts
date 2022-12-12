import { toast } from 'react-toastify';
import { useEffect } from 'react';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import { useNavigate } from 'react-router-dom';
import { signUpUserInfoState } from '@/states/user/signUp';
import { getOAuthUrl, providers } from '@/pages/Intro';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFetcher } from '@/hooks/fetcher';
import { useLogOut } from '@/hooks/user';
import {twoFAGenDataState} from "@/states/user/twoFaGenData";

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
        }),
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
        toast.error('Something went wrong on sign up');
        console.log(error);
      }
    },
  });
  return mutation;
};

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
      queryClient.invalidateQueries({ queryKey: ['auth/refresh'] });
    },
    onError: (error: Response) => {
      if (error.status === 409) {
        toast.error('Nickname is already taken.');
      } else {
        toast.error('Failed to update nickname.');
      }
    },
  });
  return mutation;
}

export function useUpdateUserProfileImage() {
  const fetcher = useFetcher();
  const mutation = useMutation({
    mutationFn: async (image: File) => {
      const imgData = new FormData();
      imgData.append('prof_img', image);
      const res = await fetcher(
        '/user/prof-img',
        {
          method: 'PUT',
          body: imgData,
        },
        '',
      );
      if (res.ok) return res.json();
      throw res;
    },
    onSuccess: () => {
      toast.success('Your profile image has been updated.');
    },
    onError: () => {
      toast.error('Failed to update profile image.');
    },
  });
  return mutation;
}

export function useGenerateUser2FA() {
  const fetcher = useFetcher();
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetcher('/auth/2fa/generate', {
        method: 'POST',
        body: JSON.stringify({
          type: 'google',
          key: '',
        }),
      });
      if (res.ok) return res;
      throw res;
    },
    onError: (error: Response) => {
      console.log(error);
    },
  });
  return mutation;
}

export const useEnable2FA = (closeModal: () => void) => {
  const fetcher = useFetcher();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await fetcher('/auth/2fa/enable', {
        method: 'PUT',
        body: JSON.stringify({ otp: code }),
      });
      if (res.ok) return res;
      throw res;
    },
    onSuccess: () => {
      toast.success('2FA has been enabled.');
      queryClient.invalidateQueries({ queryKey: ['user'] });
      closeModal();
    },
    onError: (error) => {
      toast.error('Failed to enable 2FA');
      console.log(error);
    },
  });
  return mutation;
};

export const useUpdateUser2faInfo = (closeModal: () => void) => {
  interface Update2faInfoData {
    otp: string
    info: {
      type: string
      key: string
    }
  }

  const fetcher = useFetcher();
  const enable2Fa = useEnable2FA(closeModal);
  const set2faGenData = useSetRecoilState(twoFAGenDataState);
  const mutation = useMutation({
    mutationFn: async (data: Update2faInfoData) => {
      console.log(JSON.stringify(data));
      const res = await fetcher('/auth/2fa/info', {
        method: 'PUT',
        body: JSON.stringify({
          otp: data.otp,
          info: data.info,
        }),
      });
      if (res.ok) {
        enable2Fa.mutate(data.otp);
        set2faGenData(null);
        return res;
      }
      throw res;
    },
    onError: () => {
      toast.error('Failed to update 2FA info');
    }
  })
  return mutation;
}


export const useDisable2FA = (closeModal: () => void) => {
  const fetcher = useFetcher();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await fetcher('/auth/2fa/disable', {
        method: 'PUT',
        body: JSON.stringify({ otp: code }),
      });
      if (res.ok) return res;
      throw res;
    },
    onSuccess: () => {
      toast.success('2FA has been disabled.');
      queryClient.invalidateQueries({ queryKey: ['user'] });
      closeModal();
    },
    onError: () => {
      toast.error('Failed to disable 2FA');
    },
  });
  return mutation;
};

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
    },
  });
  return mutation;
};

