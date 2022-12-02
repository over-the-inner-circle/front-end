import {useState} from "react";
import {useDismiss, useFloating} from "@floating-ui/react-dom-interactions";

const EditAccountInfoModal = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const {floating, context} = useFloating({
    open: isModalOpen,
    onOpenChange: setIsModalOpen,
  });
  const dismiss = useDismiss(context);


}
export default EditAccountInfoModal