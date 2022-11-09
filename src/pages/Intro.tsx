import React from "react";

const Intro = () => {

  // TODO : 나중에 환경변수로 처리하거나 다른 파일로 빼기
  const FT_CLIENT_ID = "60d58a20db65c3d3fc6f876357a0cef1b73c712b381b1155eae046592e081c83";
  const FT_AUTH_URL = "https://api.intra.42.fr/oauth/authorize";
  const FT_REDIRECT_URL = "http://localhost:3000/login/42";

  const GOOGLE_CLIENT_ID = "691527035660-737mqoqv1fp4jsr2gv8bof9lmj7v36sv.apps.googleusercontent.com";
  const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
  const GOOGLE_REDIRECT_URL = "http://localhost:3000/login/google";

  const KAKAO_CLIENT_ID = "f8445047c2288e6ba1045bd1fd11e93e";
  const KAKAO_AUTH_URL = "https://kauth.kakao.com/oauth/authorize";
  const KAKAO_REDIRECT_URL  = "http://localhost:3000/login/kakao";
  // =================================================================


  const oAuthUrl = (authUrl: string, clientId: string, redirectUrl: string) => {
    return `${authUrl}?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=code`;
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