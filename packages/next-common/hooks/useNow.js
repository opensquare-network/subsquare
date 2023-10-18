import { useEffect, useState } from "react";

export default function useNow() {
  const [now, setNow] = useState();
  useEffect(() => {
    setNow(Date.now());
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  });
  return now;
}
