import { useRef, useEffect, useCallback } from "react";

export default function useRefCallback(handler) {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  });

  return useCallback((...args) => {
    
    return handlerRef.current(...args);
  }, []);
}
