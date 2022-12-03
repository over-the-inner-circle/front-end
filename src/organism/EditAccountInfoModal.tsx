import React, {useCallback, useEffect, useRef, useState} from "react";
import {useRecoilState, useSetRecoilState} from "recoil";
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating, useInteractions
} from "@floating-ui/react-dom-interactions";

import isEditAccountModalOpenState from "@/states/user/isEditAccountModalOpen";
import Button from "@/atom/Button";
import {useCurrentUser} from "@/hooks/user";

// interface UserInfo {
//   "user_id": string,
//   "nickname": string,
//   "provider": string,
//   "third_party_id": string,
//   "prof_img": string,
//   "mmr": number,
//   "two_factor_authentication_type": string,
//   "two_factor_authentication_key": string,
//   "created": string,
//   "deleted": string
// }

interface UserInfo {
  nickname: string;
  prof_img: string;
  two_factor_authentication_type: string;
  two_factor_authentication_key: string;
}

interface ImageInfo {
  file: File;
  url: string;
  type: string;
}

const EditAccountForm = () => {

  const setIsEditAccountModalOpen = useSetRecoilState(isEditAccountModalOpenState);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [nickname, setNickname] = useState("");
  const [is2faOn, setIs2faOn] = useState(false);
  const currentUser = useCurrentUser().data;

  useEffect(() => {
    setNickname(currentUser?.nickname || "");
    if (currentUser?.two_factor_authentication_key) {
      setIs2faOn(true);
    }

  }, [currentUser]);

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

  const onChangeUsernameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  }

  const handle2fa = () => {
    setIs2faOn(!is2faOn);
  }

  const currentProfileImageUrl = () => {
    const DEFAULT_PROFILE_IMAGE_URL = '/src/assets/default_profile_image.png';
    if (imageInfo) {
      return imageInfo.url;
    } else if (currentUser?.prof_img) {
      return currentUser.prof_img;
    } else {
      return DEFAULT_PROFILE_IMAGE_URL;
    }
  }

  const saveAccountInfo = () => {

  }

  const closeModal = () => {
    setIsEditAccountModalOpen(false);
  }

  /* sub components =========================================================== */

  const ProfileContainer = () => {
    return (
      <div className="flex flex-col stop-dragging">
        <span className="mb-2"> Profile </span>
        <div className={`h-36 w-32 bg-cover bg-white`}>
          <img src={currentProfileImageUrl()}
               alt="profile"
               className="h-36 w-32 hover:border-gray-400 text-black text-xs"
               onClick={onUploadImageButtonClick}
          />
          <input className="hidden"
                 type="file"
                 accept="image/jpeg, image/png, image/jpg"
                 ref={inputRef}
                 onChange={onUploadImage}/>
        </div>
      </div>
    )
  }

  const TwoFactorAuthContainer = () => {
    return (
      <div className="stop-dragging">
        <span> 2FactorAuth </span>
        <div className="box-content flex h-6 w-6 border-solid border-4 border-white
                              justify-center items-center hover:border-gray-400 mt-2"
             onClick={handle2fa}>
          {is2faOn ? <div className="box-content h-4 w-4 bg-white"></div> : null}
        </div>
      </div>
    )
  }

  const SaveButton = () => {
    return (
      <Button className={"bg-true-green-600 text-xs py-3 px-5"}
              onClick={saveAccountInfo}>
        Save
      </Button>
    )
  }

  /* ========================================================================== */

  return (
    <div className="flex h-full w-full flex-col flex-wrap items-center
    justify-between border-4 bg-neutral-900 p-4 font-pixel text-white">
      <div className="flex w-full items-start">
        <button onClick={closeModal}>X</button>
      </div>
      <span className={`text-xl`}>Edit Account Info</span>
      <div className="flex flex-col items-center justify-center bg-neutral-900 font-pixel text-white">
        <div className="flex flex-row gap-20 mb-16">
          <ProfileContainer />
          <div className="flex flex-col">
            <div className="mb-2 stop-dragging"> Username </div>
            <input className="w-48 h-10 bg-white text-true-gray mb-8"
                   type="text"
                   value={nickname}
                   onChange={onChangeUsernameInput}/>
            <TwoFactorAuthContainer />
          </div>
        </div>
        <div className="flex flex-row gap-20 stop-dragging">
          <SaveButton />
        </div>
      </div>
      <div className={`empty`}></div>
    </div>
  )
}

const EditAccountInfoModal = () => {

  const [isModalOpen, setIsModalOpen] = useRecoilState(isEditAccountModalOpenState);
  const {floating, context} = useFloating({
    open: isModalOpen,
    onOpenChange: setIsModalOpen,
  });
  const dismiss = useDismiss(context);
  const {getFloatingProps} = useInteractions([dismiss]);

  return (
    <FloatingPortal>
      {isModalOpen && (
        <FloatingOverlay lockScroll
                         className="flex items-center justify-center bg-neutral-800/80">
          <FloatingFocusManager context={context}
                                order={['floating', 'content']}
          >
            <div className="h-3/4 w-2/3" ref={floating} {...getFloatingProps()}>
              <EditAccountForm/>
            </div>
          </FloatingFocusManager>
        </FloatingOverlay>
      )}
    </FloatingPortal>
  )
}
export default EditAccountInfoModal