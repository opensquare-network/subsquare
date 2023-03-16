import { useEffect, useState } from "react";

export function useScrollLock(element) {
  const [isLocked, setIsLocked] = useState(false);

  let initialOverflow;

  useEffect(() => {
    const elm = element || document.body;
    if (elm) {
      initialOverflow = elm.style.overflow;

      if (isLocked) {
        elm.style.overflow = "hidden";
      }
    }

    return () => {
      if (elm) {
        elm.style.overflow = initialOverflow;
      }
    };
  }, [isLocked]);

  return [isLocked, setIsLocked];
}
