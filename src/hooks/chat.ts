import { useEffect, useRef } from "react";
import { io } from "socket.io-client";


export function useSocketRef(url: string) {
  const access_token = window.localStorage.getItem('access_token');
  const socketRef = useRef(
    io(url, {
      auth: { access_token },
      autoConnect: false,
    }),
  );

  useEffect(() => {
    const socket = socketRef.current;

    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef;
}

export function useAutoScroll(dependency: unknown) {
  const autoScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scrollElement = autoScrollRef.current;
    if (scrollElement) {
      // FIX: 맨 아래를 보고 있을 때만 동작하게 하기
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [dependency]);

  return autoScrollRef;
}
