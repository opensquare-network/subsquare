import { useEffect, useState, useRef } from "react";

export default function useDetectDevice() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  });

  const currentMobileRef = useRef(isMobile);

  useEffect(() => {
    const getIsMobileUA = () =>
      /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

    const mediaQuerySmall = window.matchMedia("(max-width: 768px)");
    const mediaQueryPointer = window.matchMedia("(pointer: coarse)");
    const mediaQueryHover = window.matchMedia("(hover: hover)");

    const checkMobile = () => {
      const isUA = getIsMobileUA();
      const isSmall = mediaQuerySmall.matches;
      const isPointer = mediaQueryPointer.matches;
      const noHover = !mediaQueryHover.matches;
      return isUA || (isPointer && noHover && isSmall);
    };

    const updateState = () => {
      const newValue = checkMobile();
      if (newValue !== currentMobileRef.current) {
        currentMobileRef.current = newValue;
        setIsMobile(newValue);
      }
    };

    let rafId;
    const handleMediaChange = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateState);
    };

    const mediaList = [mediaQuerySmall, mediaQueryPointer, mediaQueryHover];
    mediaList.forEach((mq) => mq.addEventListener("change", handleMediaChange));

    updateState();

    return () => {
      mediaList.forEach((mq) =>
        mq.removeEventListener("change", handleMediaChange),
      );
      cancelAnimationFrame(rafId);
    };
  }, []);

  return isMobile;
}
