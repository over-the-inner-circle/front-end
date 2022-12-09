import React, {useState} from "react";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions
} from "@floating-ui/react-dom-interactions";
import QRCode from "react-qr-code";
import {twoFAGenDataState} from "@/states/user/twoFaGenData";
import {isEnable2FaModalOpenState} from "@/states/user/twoFaModalStates";
import Button from "@/atom/Button";
import {useEnable2FA} from "@/hooks/user";

const TwoFaQrForm = () => {
  const setIs2FaQrModalOpen = useSetRecoilState(isEnable2FaModalOpenState);
  const twoFAGenData = useRecoilValue(twoFAGenDataState);
  const [secret, setSecret] = useState("");

  const closeModal = () => {
    setIs2FaQrModalOpen(false);
  }

  const enable2FaMutation = useEnable2FA(closeModal);

  const onChangeSecret = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecret(e.target.value);
  }

  const enable2Fa = () => {
    enable2FaMutation.mutate(secret);
    if (enable2FaMutation.isSuccess) {
      closeModal();
    }
  }


  const QRcodeContainer = () => {
    return (
      <div className="flex flex-col items-center">
        <span className="mb-4"> 2FA Init </span>
        <div className="bg-white p-1 mb-4">
          { twoFAGenData &&
            (<QRCode value={twoFAGenData.otp_auth_url}
                     size={96}
            />)
          }
        </div>
        <span className={`text-xs mb-4`}>Scan it with Google Authenticator</span>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col flex-wrap items-center
    justify-between border-4 bg-neutral-900 p-4 font-pixel text-white">
      <div className="flex w-full items-start">
        <button onClick={closeModal}>X</button>
      </div>
      {twoFAGenData && <QRcodeContainer />}
      <div className={`flex flex-col items-center`}>
        <span className={`text-sm mb-2`}> Secret </span>
        <input className="w-48 h-10 bg-white text-true-gray mb-4"
               type="text"
               value={secret}
               onChange={onChangeSecret}/>
      </div>
      <Button onClick={enable2Fa}
              className={`bg-true-green-600 text-xs`}
      >
        Enable 2FA</Button>
      <div className={`empty`} />
    </div>
  )
}

const Enable2FaModal = () => {

  const [isModalOpen, setIsModalOpen] = useRecoilState(isEnable2FaModalOpenState);
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
          <FloatingFocusManager context={context}>
            <div className="h-auto w-auto" ref={floating} {...getFloatingProps()}>
              <TwoFaQrForm />
            </div>
          </FloatingFocusManager>
        </FloatingOverlay>
      )
      }
    </FloatingPortal>
  )
}

export default Enable2FaModal