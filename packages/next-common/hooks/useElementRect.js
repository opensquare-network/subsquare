import { useState, useEffect } from "react";

export function useElementRect(elementRef) {
  const [rect, setRect] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    right: 0,
    bottom: 0,
  });

  useEffect(() => {
    if (!elementRef.current) return;

    const updateRect = () => {
      const el = elementRef.current;
      if (el) {
        const newRect = el.getBoundingClientRect();
        setRect({
          top: newRect.top,
          left: newRect.left,
          width: newRect.width,
          height: newRect.height,
          right: newRect.right,
          bottom: newRect.bottom,
        });
      }
    };

    updateRect();

    const resizeObserver = new ResizeObserver(updateRect);
    resizeObserver.observe(elementRef.current);

    window.addEventListener("scroll", updateRect, true);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [elementRef]);

  return rect;
}
