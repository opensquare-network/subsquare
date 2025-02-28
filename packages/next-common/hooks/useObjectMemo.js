import { isEqual } from "lodash-es";
import { useRef, useMemo } from "react";

export default function useObjectMemo(obj) {
  const ref = useRef(obj);
  return useMemo(() => {
    if (!isEqual(ref.current, obj)) {
      ref.current = obj;
    }
    return ref.current;
  }, [obj]);
}
