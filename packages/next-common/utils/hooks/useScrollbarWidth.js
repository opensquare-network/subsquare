// https://github.com/streamich/react-use/blob/master/src/useScrollbarWidth.ts

import { scrollbarWidth } from "../../npm/scrollbarWidth";
import { useEffect, useState } from "react";

export function useScrollbarWidth() {
  const [sbw, setSbw] = useState(scrollbarWidth());

  // this needed to ensure the scrollbar width in case hook called before the DOM is ready
  useEffect(() => {
    if (typeof sbw !== "undefined") {
      return;
    }

    const raf = requestAnimationFrame(() => {
      setSbw(scrollbarWidth());
    });

    return () => cancelAnimationFrame(raf);
  }, []);

  return sbw;
}
