import { useEffect, useState } from "react";

export default function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(0);

  useEffect(() => {
    setNow(Date.now());
    const interval = setInterval(() => {
      setNow(Date.now());
    }, intervalMs);

    return () => {
      clearInterval(interval);
    };
  }, [intervalMs]);

  return now;
}
