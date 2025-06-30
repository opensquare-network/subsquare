import queryCoretimeScanHeight from "next-common/services/gql/coretime/scanHeight";
import { useChainSettings } from "next-common/context/chain";
import { useCallback, useEffect } from "react";
import { useSetCoretimeScanHeight } from "./scanHeight";

export default function useLoopCoretimeScanHeight() {
  const { blockTime } = useChainSettings();
  const setScanHeight = useSetCoretimeScanHeight();

  const fetchAndUpdateHeight = useCallback(async () => {
    const scanHeight = await queryCoretimeScanHeight();
    setScanHeight(scanHeight);
  }, [setScanHeight]);

  useEffect(() => {
    const interval = setInterval(
      () => {
        fetchAndUpdateHeight().then(() => {
          // scan height updated
        });
      },
      parseInt(blockTime) || 12000,
    );
    return () => clearInterval(interval);
  }, [fetchAndUpdateHeight, blockTime]);
}
