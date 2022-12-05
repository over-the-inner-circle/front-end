import Button from "@/atom/Button";
import {useNavigate} from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col w-full h-full bg-neutral-900 items-center justify-center text-white font-pixel">
      <span className="text-5xl mb-8">:(</span>
      <span className="text-3xl mb-8">404 Not Found</span>
      <Button className="bg-green-600"
              onClick={() => {navigate("/")}}>
        GO TO HOME
      </Button>
    </div>
  );
}

export default NotFound