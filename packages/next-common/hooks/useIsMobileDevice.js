import { useEffect, useState } from "react";
import { useMountedState } from "react-use";

function isMobileDevice() {
  return /android|iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

/**
 * @description is Android or iOS mobile
 */
export function useIsMobileDevice() {
  const [isMobile, setIsMobile] = useState(false);
  const isMounted = useMountedState();

  useEffect(() => {
    if (isMounted()) {
      setIsMobile(isMobileDevice());
    }
  }, [isMounted]);

  return isMobile;
}
