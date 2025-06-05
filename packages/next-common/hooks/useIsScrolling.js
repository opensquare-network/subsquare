import { useState, useEffect, useRef } from "react";
import { debounce } from "lodash-es";
import { useWindowScroll } from "react-use";

/**
 *
 * @param {number} threshold - Scroll distance
 * @param {number} debounceTime - debounce time for scroll end event, also used as hide delay (default: 200ms)
 * @returns {boolean} - Whether the element should be visible
 */
export default function useIsScrolling(threshold = 0, debounceTime = 200) {
  const { y: scrollY } = useWindowScroll();
  const [isScrolling, setIsScrolling] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScrollEnd = debounce(() => {
      setIsScrolling(false);
      lastScrollY.current = scrollY;
    }, debounceTime);

    if (!isScrolling && Math.abs(lastScrollY.current - scrollY) > threshold) {
      setIsScrolling(true);
    }

    handleScrollEnd();

    return () => {
      handleScrollEnd.cancel();
    };
  }, [debounceTime, isScrolling, scrollY, threshold]);

  return isScrolling;
}
