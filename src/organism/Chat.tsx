import { useState } from "react";

const Chat = () => {
    const [showChatSidebar, setChatSidebar] = useState(false);

    return (
        <>
            {
                showChatSidebar ? (
                    <div className="bg-blue-500 col-span-1 row-span-2 col-start-2 row-start-2 h-full w-[450px]" id="side">side</div>
                ) : (
                    <div></div>
                )
            }

        </>
    );
}

export default Chat;