import { useIsMobileDevice } from "next-common/hooks/useIsMobileDevice";

export default function MobileOnly({ children }) {
  const isMobile = useIsMobileDevice();

  if (!isMobile) {
    return null;
  }

  return children;
}
