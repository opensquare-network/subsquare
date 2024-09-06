import { useEffect, useState, useRef } from "react";

export function useScrollLock(element) {
  const [isLocked, setIsLocked] = useState(false);
  const initialOverflowRef = useRef();

  useEffect(() => {
    const elm = element || document.body;
    if (elm) {
      initialOverflowRef.current = elm.style.overflow;

      if (isLocked) {
        elm.style.overflow = "hidden";
      }
    }

    return () => {
      if (elm) {
        elm.style.overflow = initialOverflowRef.current || "";
      }
    };
  }, [isLocked, element]);

  return [isLocked, setIsLocked];
}
