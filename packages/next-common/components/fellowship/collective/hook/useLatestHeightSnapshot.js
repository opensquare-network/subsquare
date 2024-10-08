import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";

export default function useLatestHeightSnapshot() {
  const api = useContextApi();
  const [latestHeight, setLatestHeight] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (api) {
      api.rpc.chain.getHeader((header) => {
        const latestUnFinalizedHeight = header.number.toNumber();
        setLatestHeight(latestUnFinalizedHeight);
        setIsLoading(false);
      });
    }
  }, [api]);
  return {
    isLoading,
    latestHeight,
  };
}
