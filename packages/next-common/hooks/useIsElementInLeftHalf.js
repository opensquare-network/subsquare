import { useScreenRect } from "./useScreenRect";

const { useEffect, useState } = require("react");

export default function useIsElementInLeftHalf(elementRef) {
  const containerRect = useScreenRect();
  const [isInLeftHalf, setIsInLeftHalf] = useState(false);

  useEffect(() => {
    const checkPosition = () => {
      const element = elementRef?.current;
      if (!element) {
        return;
      }
      const innerRect = element.getBoundingClientRect();
      const containerCenterY = containerRect.width / 2;
      const innerCenterY = innerRect.left + innerRect.width / 2;
      const isInLeftHalf = innerCenterY < containerCenterY;
      setIsInLeftHalf(isInLeftHalf);
    };

    checkPosition();
    window.addEventListener("scroll", checkPosition);
    window.addEventListener("resize", checkPosition);
    return () => {
      window.removeEventListener("scroll", checkPosition);
      window.removeEventListener("resize", checkPosition);
    };
  }, [containerRect, elementRef]);

  return isInLeftHalf;
}
