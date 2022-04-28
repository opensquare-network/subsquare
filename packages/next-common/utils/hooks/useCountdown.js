import { useState, useEffect } from "react";
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

  const startCountdown = () => setCounting(true);

  return { countdown, counting, startCountdown };
}
