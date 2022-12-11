import { useNavigate } from 'react-router-dom';
import { accessTokenState } from '@/states/user/auth';
import { useSetRecoilState } from 'recoil';

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
