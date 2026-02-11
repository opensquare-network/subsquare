import { useEffect, useState, useMemo, useRef } from "react";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";
import { isNil } from "lodash-es";

export default function useAhmLatestHeightSnapshot() {
  const ahmLatestHeight = useAhmLatestHeight();
  const snapshotRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isNil(ahmLatestHeight) || !isNil(snapshotRef.current)) {
      return;
    }

    snapshotRef.current = ahmLatestHeight;
    setIsLoading(false);
  }, [ahmLatestHeight]);

  return useMemo(
    () => ({
      isLoading,
      // eslint-disable-next-line react-hooks/refs
      latestHeight: snapshotRef.current,
    }),
    [isLoading],
  );
}
