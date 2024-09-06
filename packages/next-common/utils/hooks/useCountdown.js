import { useState, useEffect, useCallback } from "react";
import { useMountedState } from "react-use";

export default function useCountdown(initSeconds) {
  const isMounted = useMountedState();
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
      if (isMounted()) {
        setCountdown(countdown - 1);
      }
    }, 1000);
  }, [counting, countdown, isMounted]);

  const startCountdown = useCallback(() => setCounting(true), []);
  const resetCountdown = useCallback(() => {
    setCountdown(initSeconds);
    setCounting(false);
  }, [initSeconds]);

  return { countdown, counting, startCountdown, resetCountdown };
}
