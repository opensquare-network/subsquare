import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";
import { useChainState } from "next-common/context/chain";

export default function useLatestHeightSnapshot() {
  const api = useContextApi();
  const [{ latestHeight }, setChainState] = useChainState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.rpc.chain
      .getHeader()
      .then((header) => {
        const latestUnFinalizedHeight = header.number.toNumber();
        setChainState((val) => {
          return {
            ...val,
            latestHeight: latestUnFinalizedHeight,
          };
        });
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        throw new Error("Failed to fetch latest height:", error);
      });
  }, [api, setChainState]);
  return {
    isLoading,
    latestHeight,
  };
}
