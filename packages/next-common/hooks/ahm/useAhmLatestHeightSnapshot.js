import { useEffect, useState } from "react";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";

export default function useAhmLatestHeightSnapshot() {
  const ahmLatestHeight = useAhmLatestHeight();
  const [snapshotHeight, setSnapshotHeight] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!ahmLatestHeight || !isLoading) {
      return;
    }

    setSnapshotHeight(ahmLatestHeight);
    setIsLoading(false);
  }, [isLoading, ahmLatestHeight]);

  return {
    isLoading,
    latestHeight: snapshotHeight,
  };
}
