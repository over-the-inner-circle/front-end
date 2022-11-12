import React from "react";

const Intro = () => {

  // TODO : 나중에 환경변수로 처리하거나 다른 파일로 빼기
  const FT_CLIENT_ID = import.meta.env.VITE_FT_CLIENT_ID;
  const FT_AUTH_URL = import.meta.env.VITE_FT_AUTH_URL;
  const FT_REDIRECT_URL = import.meta.env.VITE_FT_REDIRECT_URL;

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const GOOGLE_AUTH_URL = import.meta.env.VITE_GOOGLE_AUTH_URL;
  const GOOGLE_REDIRECT_URL = import.meta.env.VITE_GOOGLE_REDIRECT_URL;

  const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
  const KAKAO_AUTH_URL = import.meta.env.VITE_KAKAO_AUTH_URL;
  const KAKAO_REDIRECT_URL = import.meta.env.VITE_KAKAO_REDIRECT_URL;
  // =================================================================


  const oAuthUrl = (authUrl: string, clientId: string, redirectUrl: string) => {
    const result = `${authUrl}?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=code`;
    return result;
  }

  const loginWith42 = () => {
    window.location.href = oAuthUrl(FT_AUTH_URL, FT_CLIENT_ID, FT_REDIRECT_URL);
  }

  const loginWithGoogle = () => {
    window.location.href = oAuthUrl(GOOGLE_AUTH_URL, GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URL) + "&scope=https://www.googleapis.com/auth/userinfo.profile";
  }

  const loginWithKakao = () => {
    window.location.href = oAuthUrl(KAKAO_AUTH_URL, KAKAO_CLIENT_ID, KAKAO_REDIRECT_URL);
  }

  return (
    <div className="flex h-screen bg-true-gray stop-dragging">
      <div className="m-auto font-pixel">
        <div className="text-7xl text-white mb-20 text-center">42pong</div>
        <div className="">
          <div className="text-white text-sm mb-4">Start with:</div>
          <div className="flex flex-row gap-10 text-xl">
            <button className="text-color-42 hover:text-white" onClick={loginWith42}>42</button>
            <button className="text-color-kakao hover:text-white" onClick={loginWithKakao}>Kakao</button>
            <button className="text-blue-600 hover:text-white" onClick={loginWithGoogle}>Google</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Intro;