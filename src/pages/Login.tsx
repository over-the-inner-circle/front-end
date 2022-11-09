import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Login = () => {

  const REQUEST_URL = "http://146.56.153.237:80";
  const params = useParams();
  const navigate = useNavigate();

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
        //TODO: 에러처리
        return null;
      }
  }

  useEffect(() => {

    const provider: string = params.provider || "";
    const urlQuery = new URLSearchParams(window.location.search);
    const code = urlQuery.get("code");

    console.log("login page called");
    console.log(`provider is ${params.provider}`);
    console.log(`code is ${code}`);
    console.log(JSON.stringify({code}));

    if (!code || code === "") {
      // TODO : 에러처리
      return;
    }
    if (!['42', 'google', 'kakao'].includes(provider)) {
      // TODO : 에러처리
      return;
    }
    const result = fetchUserData(provider, code);
    result.then((data) => {
      if (data.access_token) {
        // user exists. Redirect to main page with access token and refresh token
        console.log("user exists");
        console.log(data);
      } else if (data.provider) {
        // user doesn't exist. Redirect to signup page with Oauth user info data.
        console.log("user doesn't exist")
        console.log(data);
        navigate("/sign-up", { state:
        {
          provider: data.provider,
          thirdPartyId: data.third_party_id,
          profImg: data.prof_img,
          locale: data.locale,
        }});
      }
    });

    // TODO: 나중에 지우기
    // setTimeout(() => {
    //   // navigate("/main");
    //   navigate("/sign-up", { state: {
    //       provider: "42",
    //       thirdPartyId: "123456",
    //       profImg: "",
    //       locale: "ko",
    //     }});
    // }, 1000);
  }
  , [params, navigate]);

  return (
    <div className="flex h-screen bg-true-gray">
      <div className="m-auto font-pixel text-2xl text-white">
        Signing in...
      </div>
    </div>
  );
}

export default Login;
