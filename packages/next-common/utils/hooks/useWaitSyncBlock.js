import { useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { sleep } from "..";
import { getBlockHeightFromHash } from "../chain";
import {
  newErrorToast,
  newPendingToast,
  newSuccessToast,
  newToastId,
  removeToast,
} from "../../store/reducers/toastSlice";
import { useContextApi } from "next-common/context/api";
import { useScanHeight } from "next-common/hooks/scanHeight";

export default function useWaitSyncBlock(toastMessage, callback) {
  const scanHeight = useScanHeight();
  const dispatch = useDispatch();
  const api = useContextApi();

  const refScanHeight = useRef();
  useEffect(() => {
    refScanHeight.current = scanHeight;
  }, [scanHeight]);

  return useCallback(
    async (blockHash) => {
      dispatch(newSuccessToast(toastMessage, 1000));

      if (!api) {
        return;
      }

      const toastId = newToastId();
      setTimeout(async () => {
        dispatch(newPendingToast(toastId, "Syncing on-chain data..."));
        try {
          const targetHeight = await getBlockHeightFromHash(api, blockHash);

          let times = 12;
          while (times-- > 0) {
            await sleep(10000);
            if (refScanHeight.current >= targetHeight) {
              break;
            }
          }

          const reachingFinalizedBlock = times >= 0;
          callback(reachingFinalizedBlock);
        } catch (e) {
          dispatch(newErrorToast(e.message));
        } finally {
          dispatch(removeToast(toastId));
        }
      }, 1000);
    },
    [dispatch, api, refScanHeight, callback, toastMessage],
  );
}
