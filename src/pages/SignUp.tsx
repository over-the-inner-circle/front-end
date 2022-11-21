import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { signUpUserInfoState } from '@/states/user/signUp';
import Button from '@/atom/Button';

interface ImageInfo {
  file: File;
  url: string;
  type: string;
}

const SignUp = () => {

  const REQUEST_URL = import.meta.env.VITE_REQUEST_URL;
  const DEFAULT_PROFILE_IMAGE_URL = '/src/assets/default_profile_image.png';

  const [is2faOn, setIs2faOn] = useState(false);
  const [nickname, setNickname] = useState("");
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);

  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const signUpUserInfo = useRecoilValue(signUpUserInfoState);
  useEffect(() => {
    if (!signUpUserInfo) {
      navigate('/');
    }
  }, [signUpUserInfo, navigate]);

  // const onUploadImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (!e.target.files) {
  //     return;
  //   }
  //   console.log(e.target.value);
  //   // setImgUrl(e.target.value);
  // }, []);

  const onUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;

    if (fileList && fileList[0]) {
      const fileUrl = URL.createObjectURL(fileList[0]);
      setImageInfo({
        file: fileList[0],
        url: fileUrl,
        type: fileList[0].type
      })
    }
    console.log(imageInfo);
  }

  const onUploadImageButtonClick = useCallback(() => {
    if (!inputRef.current) {
      return;
    }
    inputRef.current.click();
  }, []);

  const currentProfileImageUrl = () => {
    if (imageInfo) {
      return imageInfo.url;
    } else if (signUpUserInfo?.prof_img) {
      return signUpUserInfo.prof_img;
    } else {
      return DEFAULT_PROFILE_IMAGE_URL;
    }
  }

  const signUpNewUser = async () => {
    // TODO : 회원가입 API POST 요청
    const response = await fetch(`${REQUEST_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nickname,
        ...signUpUserInfo,
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

  const handle2fa = () => {
    setIs2faOn(!is2faOn);
    // TODO: 2fa on/off
  }

  const onChangeUsernameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-neutral-900 font-pixel text-white z-0">
      <div className="flex flex-row gap-20 mb-16">
        <div className="flex flex-col stop-dragging">
        <span className="mb-2"> Profile </span>
        <div className={`h-36 w-32 bg-cover bg-white`}>
          <img src={currentProfileImageUrl()}
               alt="profileImage"
               className="h-36 w-32 hover:border-gray-400"
               onClick={onUploadImageButtonClick}
          />
          {/*<div className="text-neutral-200 text-stroke text-3xl hover:text-neutral-400 z-50"*/}
          {/*     onClick={onUploadImageButtonClick}> +*/}
          {/*</div>*/}
          <input className="hidden"
                 type="file"
                 accept="image/jpeg, image/png, image/jpg"
                 ref={inputRef}
                 onChange={onUploadImage}/>
        </div>
      </div>
        <div className="flex flex-col">
          <div className="mb-2 stop-dragging"> Username </div>
          <input className="w-48 h-10 bg-white text-true-gray mb-10"
                 type="text"
                 value={nickname}
                 onChange={onChangeUsernameInput}/>
          <div className="stop-dragging">
            <span> 2FactorAuth </span>
            <div className="box-content flex h-6 w-6 border-solid border-4 border-white
                            justify-center items-center hover:border-gray-400 mt-2"
                  onClick={handle2fa}>
              {is2faOn ? <div className="box-content h-4 w-4 bg-white"></div> : null}
           </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-20 stop-dragging">
        <Button className={"bg-true-gray-600 text-xs py-3 px-5 hover:bg-neutral-400"}
                onClick={cancelSignUp}>
          Cancel
        </Button>
        <Button className={"bg-true-green-600 text-xs py-3 px-5 hover:bg-green-400"}
                onClick={signUpNewUser}>
          Sign Up
        </Button>
      </div>
    </div>
  );
}

export default SignUp;
