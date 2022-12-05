import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { useMutation } from '@tanstack/react-query';
import { useFetcher } from '@/hooks/fetcher';
import { SignUpUserInfo, signUpUserInfoState } from '@/states/user/signUp';
import { toast } from 'react-toastify';
import { accessTokenState } from '@/states/user/auth';

interface LoginParams {
  provider: string;
  code: string;
}

function useLoginMutation() {
  const navigate = useNavigate();
  const setSignupUserInfo = useSetRecoilState(signUpUserInfoState);
  const setAccessToken = useSetRecoilState(accessTokenState);
  const fetcher = useFetcher();

  const mutation = useMutation({
    mutationFn: async ({ code, provider }: LoginParams) => {
      const res = await fetcher(`/auth/oauth2/${provider}`, {
        method: 'POST',
        body: JSON.stringify({ code }),
      });
      if (!res.ok) throw res;

      return res.json();
    },
    onSuccess: (data) => {
      if ('access_token' in data) {
        setAccessToken(data.access_token);
        window.localStorage.setItem('refresh_token', data.refresh_token);
        return navigate('/main');
      }
      if ('provider' in data) {
        setSignupUserInfo(data as SignUpUserInfo);
        return navigate('/sign-up');
      }
      throw data;
    },
  });
  return mutation;
}

function useLogin() {
  const params = useParams();
  const navigate = useNavigate();
  const { mutate, isError } = useLoginMutation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const provider: string = params.provider || '';
    const urlQuery = new URLSearchParams(window.location.search);
    const code = urlQuery.get('code');

    if (!code) {
      setError('code must be required');
      return;
    }
    if (!['42', 'google', 'kakao'].includes(provider)) {
      setError('unknown provider');
      return;
    }

    mutate({ provider, code });
  }, [params, mutate]);

  useEffect(() => {
    if (isError) {
      setError('login request failed');
    }
  }, [isError]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      navigate('/', { replace: true });
    }
  }, [error, navigate]);
}

const Login = () => {
  useLogin();

  return (
    <div className="flex h-screen bg-true-gray">
      <div className="m-auto font-pixel text-2xl text-white">Loading...</div>
    </div>
  );
};

export default Login;
