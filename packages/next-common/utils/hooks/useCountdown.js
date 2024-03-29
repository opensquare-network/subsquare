import { useState, useEffect, useCallback } from "react";
import useIsMounted from "./useIsMounted";

export default function useCountdown(initSeconds) {
  const isMounted = useIsMounted();
  const [countdown, setCountdown] = useState(initSeconds);
  const [counting, setCounting] = useState(false);

  useEffect(() => {
    if (!counting) {
      return;
    }

    if (countdown === 0) {
      return;
    }

    setTimeout(() => {
      if (isMounted.current) {
        setCountdown(countdown - 1);
      }
    }, 1000);
  }, [counting, countdown, isMounted]);

  const startCountdown = useCallback(() => setCounting(true), []);
  const resetCountdown = useCallback(() => {
    setCountdown(initSeconds);
    setCounting(false);
  }, []);

  return { countdown, counting, startCountdown, resetCountdown };
}
