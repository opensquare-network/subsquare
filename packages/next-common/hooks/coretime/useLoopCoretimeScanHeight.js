import { setNodeBlockHeight } from "next-common/store/reducers/nodeSlice";
import { useDispatch } from "react-redux";
import queryCoretimeScanHeight from "next-common/services/gql/coretime/scanHeight";
import { useChainSettings } from "next-common/context/chain";
import { useCallback, useEffect } from "react";

export default function useLoopCoretimeScanHeight() {
  const dispatch = useDispatch();
  const { blockTime } = useChainSettings();

  const fetchAndUpdateHeight = useCallback(async () => {
    const scanHeight = await queryCoretimeScanHeight();
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
  }, [fetchAndUpdateHeight, blockTime]);
}
