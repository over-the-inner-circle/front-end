import React from "react";
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
import {twoFAGenDataState} from "@/states/user/TwoFaGenData";
import {is2FaQrModalOpenState} from "@/states/user/is2FaQrModalOpen";



const TwoFaQrForm = () => {
  const setIs2FaQrModalOpen = useSetRecoilState(is2FaQrModalOpenState);
  const twoFAGenData = useRecoilValue(twoFAGenDataState);

  const closeModal = () => {
    setIs2FaQrModalOpen(false);
  }
  return (
    <div className="flex h-full w-full flex-col flex-wrap items-center
    justify-between border-4 bg-neutral-900 p-4 font-pixel text-white">
      <div className="flex w-full items-start">
        <button onClick={closeModal}>X</button>
      </div>
      <span> 2FA QR MODAL </span>
      { twoFAGenData &&
        (<QRCode value={twoFAGenData.otpauthUrl}/>)
      }
    </div>
  )
}

const TwoFaQrcodeModal = () => {

  const [isModalOpen, setIsModalOpen] = useRecoilState(is2FaQrModalOpenState);
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
            <div className="h-2/5 w-2/5" ref={floating} {...getFloatingProps()}>
              <TwoFaQrForm />
            </div>
          </FloatingFocusManager>
        </FloatingOverlay>
      )
      }
    </FloatingPortal>
  )
}

export default TwoFaQrcodeModal