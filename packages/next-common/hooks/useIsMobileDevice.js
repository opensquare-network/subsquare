import { usePageProperties } from "next-common/context/page";

function isMobileDevice(userAgent) {
  return /android|iphone|ipad|ipod/i.test(userAgent);
}

/**
 * @description is Android or iOS mobile
 */
export function useIsMobileDevice() {
  const { userAgent } = usePageProperties();
  return isMobileDevice(userAgent);
}
