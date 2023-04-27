import { useEffect, useState } from "react";

export default function useStateChanged(value) {
  const [prevState, setPrevState] = useState(value);
  const changed = prevState !== value;
  useEffect(() => {
    setPrevState(value);
  }, [value]);
  return changed;
}
