import { useState, useEffect } from "react";

export default function useIsNearLeft(divRef) {
  const [isNearLeft, setIsNearLeft] = useState(false);

  useEffect(() => {
    const checkPosition = () => {
      if (divRef.current) {
        const rect = divRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        setIsNearLeft(rect.left <= viewportWidth / 2);
      }
    };

    checkPosition();

    // 监听窗口大小变化
    window.addEventListener("resize", checkPosition);
    return () => {
      window.removeEventListener("resize", checkPosition);
    };
  }, [divRef]);

  return isNearLeft;
}
