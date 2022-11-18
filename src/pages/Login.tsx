import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Login = () => {

  const REQUEST_URL = import.meta.env.VITE_REQUEST_URL;
  const params = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("Loading...");

  const fetchUserData = async (provider: string, code: string) => {
      const response: Response = await fetch(`${REQUEST_URL}/auth/oauth2/${provider}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code }),
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error("failed to login: " + response.statusText);
      }
  }

  useEffect(() => {

    const provider: string = params.provider || "";
    const urlQuery = new URLSearchParams(window.location.search);
    const code = urlQuery.get("code");

    if (!code || code === "") {
      // TODO : 에러처리
      return;
    }
    if (!['42', 'google', 'kakao'].includes(provider)) {
      // TODO : 에러처리
      return;
    }
    const result = fetchUserData(provider, code);
    //TODO: Result 없을 때 처리
    result
      .then((data) => {
      if (data.access_token) {
        // 회원이 있는 경우: 액세스 토큰 저장 후 메인페이지로 리다이렉션.
        window.localStorage.setItem("access_token", data.access_token);
        window.localStorage.setItem("refresh_token", data.refresh_token);
        navigate("/main");
      } else if (data.provider) {
        // 회원이 없는 경우: 회원가입 페이지로 리다이렉션. 회원가입에 필요한 정보를 state로 전달.
        navigate("/sign-up", { state:
        {
          provider: data.provider,
          thirdPartyId: data.third_party_id,
          profImg: data.prof_img,
          locale: data.locale,
        }});
      } else {
        // TODO : 에러처리
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }
  , [params, navigate]);

  return (
    <div className="flex h-screen bg-true-gray">
      <div className="m-auto font-pixel text-2xl text-white">
        {message}
      </div>
    </div>
  );
}

export default Login;
