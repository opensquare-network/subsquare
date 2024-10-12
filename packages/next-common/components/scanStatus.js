import { useCallback, useEffect } from "react";
import { useChainState, useChainSettings } from "next-common/context/chain";
import nextApi from "next-common/services/nextApi";

export default function ScanStatusComponent({ children }) {
  const [, setChainState] = useChainState();
  const { blockTime } = useChainSettings();

  const fetchAndUpdateHeight = useCallback(async () => {
    // todo: we should update only on chain state and timeline
    const { result: { value: scanHeight } = {} } = await nextApi.fetch(
      "inspect/scan-height",
    );

    setChainState((val) => {
      return {
        ...val,
        scanHeight,
      };
    });
  }, [setChainState]);

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
  }, [blockTime, fetchAndUpdateHeight]);

  return children;
}
