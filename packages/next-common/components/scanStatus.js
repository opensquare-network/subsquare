import { useCallback, useEffect } from "react";
import { setNodeBlockHeight } from "../store/reducers/nodeSlice";
import { useChainSettings } from "next-common/context/chain";
import nextApi from "next-common/services/nextApi";
import { useDispatch } from "react-redux";

export default function ScanStatusComponent({ children }) {
  const { blockTime } = useChainSettings();
  const dispatch = useDispatch();

  const fetchAndUpdateHeight = useCallback(async () => {
    // todo: we should update only on chain state and timeline
    const { result: { value: scanHeight } = {} } = await nextApi.fetch(
      "inspect/scan-height",
    );
    dispatch(setNodeBlockHeight(scanHeight));
  }, [dispatch]);

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
