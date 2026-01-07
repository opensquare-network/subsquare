import { useCallback, useEffect, useState } from "react";

export default function useCountdown() {
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((v) => v - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const start = useCallback((seconds) => {
    setCountdown(seconds);
  }, []);

  const stop = useCallback(() => {
    setCountdown(0);
  }, []);

  return {
    countdown,
    start,
    stop,
  };
}
