import { useEffect } from "react";

export default function useEnsureElementInRect(element, containerRef) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    function adjustPosition() {
      if (!container || !element) {
        return;
      }

      const elementRect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      let translateX = 0;
      let translateY = 0;

      if (elementRect.right > containerRect.right) {
        translateX -= elementRect.right - containerRect.right;
      }
      if (elementRect.left < containerRect.left) {
        translateX += containerRect.left - elementRect.left;
      }
      if (elementRect.bottom > containerRect.bottom) {
        translateY -= elementRect.bottom - containerRect.bottom;
      }
      if (elementRect.top < containerRect.top) {
        translateY += containerRect.top - elementRect.top;
      }

      element.style.transform = `translate(${translateX}px, ${translateY}px)`;
    }

    adjustPosition();

    container.addEventListener("resize", adjustPosition);
    container.addEventListener("scroll", adjustPosition);

    return () => {
      container.removeEventListener("resize", adjustPosition);
      container.removeEventListener("scroll", adjustPosition);
    };
  }, [containerRef, element]);
}
