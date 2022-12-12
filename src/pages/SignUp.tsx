import { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/atom/Button';
import {useSignUpUser} from "@/hooks/mutation/user";
import {isValidNickname} from "@/hooks/user";

const SignUp = () => {
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();
  const signUp = useSignUpUser();

  const signUpNewUser = async () => {
    if (isValidNickname(nickname)) {
      signUp.mutate(nickname);
    }
  }

  const cancelSignUp = () => {
    // TODO : 회원가입 취소
    navigate("/");
  };

  const onChangeUsernameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-neutral-900 font-pixel text-white z-0">
      <div className="flex flex-row gap-20 mb-16">
        <div className="flex flex-col">
          <div className="mb-2 stop-dragging"> Username </div>
          <input className="w-48 h-10 bg-white text-true-gray"
                 type="text"
                 value={nickname}
                 onChange={onChangeUsernameInput}/>
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
  )
}

export default SignUp;
