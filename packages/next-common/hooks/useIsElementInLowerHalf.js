import { useScreenRect } from "./useScreenRect";

const { useEffect, useState } = require("react");

export default function useIsElementInLowerHalf(elementRef) {
  const containerRect = useScreenRect();
  const [isInLowerHalf, setIsInLowerHalf] = useState(false);

  useEffect(() => {
    const checkPosition = () => {
      const element = elementRef?.current;
      if (!element) {
        return;
      }
      const innerRect = element.getBoundingClientRect();
      const containerCenterY = containerRect.height / 2;
      const innerCenterY = innerRect.top + innerRect.height / 2;
      const isInLowerHalf = innerCenterY > containerCenterY;
      setIsInLowerHalf(isInLowerHalf);
    };

    checkPosition();
    window.addEventListener("scroll", checkPosition);
    window.addEventListener("resize", checkPosition);
    return () => {
      window.removeEventListener("scroll", checkPosition);
      window.removeEventListener("resize", checkPosition);
    };
  }, [containerRect, elementRef]);

  return isInLowerHalf;
}
