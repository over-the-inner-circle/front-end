import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating, useInteractions
} from "@floating-ui/react-dom-interactions";
import {useRecoilState, useSetRecoilState} from "recoil";
import isEditAccountModalOpenState from "@/states/user/isEditAccountModalOpen";


const EditAccountForm = () => {

  const setIsEditAccountModalOpen = useSetRecoilState(isEditAccountModalOpenState);

  const close = () => {
    setIsEditAccountModalOpen(false);
  }

  return (
    <div className="flex h-full w-full flex-col flex-wrap items-center
    justify-start border-4 bg-neutral-900 p-4 font-pixel text-white">
      <div className="flex w-full items-start">
        <button onClick={close}>X</button>
      </div>
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
          <FloatingFocusManager context={context}>
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