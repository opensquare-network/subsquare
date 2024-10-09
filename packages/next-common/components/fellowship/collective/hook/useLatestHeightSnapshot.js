import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";

export default function useLatestHeightSnapshot() {
  const api = useContextApi();
  const [latestHeight, setLatestHeight] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.rpc.chain
      .getHeader()
      .then((header) => {
        const latestUnFinalizedHeight = header.number.toNumber();
        setLatestHeight(latestUnFinalizedHeight);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        throw new Error("Failed to fetch latest height:", error);
      });
  }, [api]);
  return {
    isLoading,
    latestHeight,
  };
}
