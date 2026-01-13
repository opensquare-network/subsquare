import { useEffect, useRef, useState } from "react";
import { stringify } from "@polkadot/util";

export default function useMapKeys(entry, params, { transform } = {}, at) {
  const [state, setState] = useState();
  const checkRef = useRef(null);

  useEffect(() => {
    if (entry && params) {
      const check = stringify({ at, params });

      if (check !== checkRef.current) {
        checkRef.current = check;

        (at && at !== "0" ? entry.keysAt(at, ...params) : entry.keys(...params))
          .then((keys) => setState(transform ? transform(keys) : keys))
          .catch(console.error);
      }
    }
  }, [at, entry, params, transform]);

  return state;
}
