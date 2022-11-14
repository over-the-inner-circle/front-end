import {useEffect, useRef} from "react";
import {io, ManagerOptions, Socket, SocketOptions} from "socket.io-client";

const useSocket = (
  uri: string,
  opts?: Partial<ManagerOptions & SocketOptions> | undefined
): Socket => {

  const { current: socket } = useRef(io(uri, opts));

  useEffect(() => {
    return () => {
      if (socket) { socket.close(); }
    };
  }, [socket]);

  return socket;
}

export default useSocket;