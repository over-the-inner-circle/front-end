import {is2FaQrModalOpenState} from "@/states/user/is2FaQrModalOpen";
import {useRecoilState} from "recoil";
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions
} from "@floating-ui/react-dom-interactions";
import React from "react";

const TwoFaQrForm = () => {
  return (
    <div className="flex h-full w-full flex-col flex-wrap items-center
    justify-between border-4 bg-neutral-900 p-4 font-pixel text-white">
      <span> 2FA QR MODAL </span>
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