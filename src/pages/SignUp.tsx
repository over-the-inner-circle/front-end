import React, { useState, useEffect } from "react";
import {useLocation, useNavigate} from "react-router-dom";

const SignUp = () => {

  const REQUEST_URL = "http://146.56.153.237";

  const [is2faOn, setIs2faOn] = useState(false);
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const newUserInfo = location.state;

  const signUpNewUser = async () => {
    // TODO : 회원가입 API POST 요청
    const response = await fetch(`${REQUEST_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "nickname": nickname,
        "provider": newUserInfo.provider,
        "third_party_id": newUserInfo.thirdPartyId,
        "prof_img": newUserInfo.profImg,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      // TODO: 다시 Login으로...

      //navigate("/main");
    } else {
      const error = await response.text();
      console.log(error);
    }
  }

  const cancelSignUp = () => {
    // TODO : 회원가입 취소
    navigate("/");
  };

  const handleGoogle2fa = () => {
    setIs2faOn(!is2faOn);
    // TODO: 2fa on/off
  }

  const onChangeUsernameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  }

  const addProfilePhoto = () => {
    // TODO : 프로필 사진 추가
  }

  return (
    <div className="flex h-screen bg-true-gray text-white font-pixel">
      <div className="m-auto justify-center">
          <div className="flex flex-row justify-center mb-20">
            <div className="mr-20 stop-dragging">
              <div className="mb-2"> Profile </div>
              <div className="box-content h-36 w-32 bg-white flex justify-center items-center"
                   onClick={addProfilePhoto}>
                <div className="text-3xl text-true-gray hover:text-gray-400"> + </div>
              </div>
            </div>
            <div>
              <div className="mb-10">
                <div className="mb-2 stop-dragging"> Username </div>
                <input type="text" className="text-true-gray w-48 h-10" onChange={onChangeUsernameInput}/>
              </div>
              <div className={"stop-dragging"}>
                <div className={"mb-2"}>Google 2FA</div>
                <div className="box-content flex h-6 w-6 border-solid border-4 border-white justify-center items-center hover:border-gray-400"
                     onClick={handleGoogle2fa}>
                  {is2faOn ? <div className="box-content h-4 w-4 bg-white "></div> : null}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-20 justify-center stop-dragging">
            <button className={"bg-true-green-600 text-xs py-3 px-5 hover:bg-green-400"}
                    onClick={signUpNewUser}>
              Sign Up
            </button>
            <button className={"bg-true-gray-600 text-xs py-3 px-6 hover:bg-gray-400"}
                    onClick={cancelSignUp}>
              Cancel
            </button>
          </div>
      </div>
    </div>
  );
}

export default SignUp;