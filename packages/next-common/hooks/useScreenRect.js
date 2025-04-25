import { useState, useEffect } from "react";

export function useScreenRect() {
  const [rect, setRect] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setRect({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return rect;
}
