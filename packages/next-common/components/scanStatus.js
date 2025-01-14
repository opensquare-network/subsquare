import { useCallback, useEffect } from "react";
import { setNodeBlockHeight } from "../store/reducers/nodeSlice";
import { useChainSettings } from "next-common/context/chain";
import { useDispatch } from "react-redux";
import { fetchScanHeight } from "next-common/services/fetchScanHeight";

export default function ScanStatusComponent({ children, scanHeight }) {
  const { blockTime } = useChainSettings();
  const dispatch = useDispatch();

  useEffect(() => {
    if (scanHeight) {
      dispatch(setNodeBlockHeight(scanHeight));
    }
  }, [dispatch, scanHeight]);

  const fetchAndUpdateHeight = useCallback(async () => {
    // todo: we should update only on chain state and timeline
    const scanHeight = await fetchScanHeight();
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
