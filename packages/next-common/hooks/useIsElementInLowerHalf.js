const { useEffect, useState } = require("react");

export default function useIsElementInLowerHalf(elementRef, containerRef) {
  const [isInLowerHalf, setIsInLowerHalf] = useState(false);

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) {
      return;
    }

    const checkPosition = () => {
      const containerElement = containerRef?.current;
      const element = elementRef?.current;
      if (!containerElement || !element) {
        return;
      }
      const containerRect = containerElement.getBoundingClientRect();
      const innerRect = element.getBoundingClientRect();
      const containerCenterY = containerRect.top + containerRect.height / 2;
      const innerCenterY = innerRect.top + innerRect.height / 2;
      const isInLowerHalf = innerCenterY > containerCenterY;
      setIsInLowerHalf(isInLowerHalf);
    };

    checkPosition();
    const handler = container.addEventListener("scroll", checkPosition);
    return () => {
      if (handler) {
        container.removeEventListener("scroll", handler);
      }
    };
  }, [containerRef, elementRef]);

  return isInLowerHalf;
}
