import { useState, useEffect, useRef } from "react";
import { throttle } from "lodash-es";

/**
 *
 * @param {number} threshold - Scroll distance
 * @param {number} throttleTime - throttle time for scroll end event, also used as hide delay (default: 200ms)
 * @returns {boolean} - Whether the element should be visible
 */
export default function useIsScrolling(threshold = 0, throttleTime = 200) {
  const [isVisible, setIsVisible] = useState(false);
  const lastScrollY = useRef(0);
  const isScrolling = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    lastScrollY.current = window.scrollY;

    const handleScrollStart = () => {
      if (!isScrolling.current) {
        isScrolling.current = true;
        setIsVisible(true);
      }
    };

    const handleScrollEnd = throttle(() => {
      isScrolling.current = false;
      setIsVisible(false);
    }, throttleTime);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastScrollY.current) > threshold) {
        handleScrollStart();
        lastScrollY.current = currentScrollY;
        handleScrollEnd();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScrollEnd.cancel();
    };
  }, [threshold, throttleTime]);

  return isVisible;
}
