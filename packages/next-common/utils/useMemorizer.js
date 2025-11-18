import { useCallback, useState } from "react";

export function useMemorizer() {
  const [objects, setObjects] = useState([]);
  return useCallback(
    (obj, keys) => {
      for (const item of objects) {
        if (
          item.keys.length === keys.length &&
          item.keys.every((key, index) => key === keys[index])
        ) {
          return item.obj;
        }
      }
      setObjects((prev) => [...prev, { obj, keys }]);
      return obj;
    },
    [objects],
  );
}
