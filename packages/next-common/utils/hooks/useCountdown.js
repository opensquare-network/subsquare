import { useState, useEffect } from "react";
import useIsMounted from "./useIsMounted";

export default function useCountdown({ initSeconds }) {
  const isMounted = useIsMounted();
  const [countdown, setCountdown] = useState(initSeconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) {
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
  }, [running, countdown, isMounted]);

  const startCountdown = () => setRunning(true);

  return { countdown, running, startCountdown };
}
