const { useEffect, useState } = require("react");

export default function useIsElementInLeftHalf(elementRef, containerRef) {
  const [isInLeftHalf, setIsInLeftHalf] = useState(false);

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
      const containerCenterY = containerRect.left + containerRect.width / 2;
      const innerCenterY = innerRect.left + innerRect.width / 2;
      const isInLeftHalf = innerCenterY < containerCenterY;
      setIsInLeftHalf(isInLeftHalf);
    };

    checkPosition();
    const handler = container.addEventListener("scroll", checkPosition);
    return () => {
      if (handler) {
        container.removeEventListener("scroll", handler);
      }
    };
  }, [containerRef, elementRef]);

  return isInLeftHalf;
}
