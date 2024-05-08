import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sleep } from "..";
import { getBlockHeightFromHash } from "../chain";
import { nodesHeightSelector } from "../../store/reducers/nodeSlice";
import {
  newErrorToast,
  newPendingToast,
  newSuccessToast,
  newToastId,
  removeToast,
} from "../../store/reducers/toastSlice";
import { useContextApi } from "next-common/context/api";

export default function useWaitSyncBlock(toastMessage, callback) {
  const scanHeight = useSelector(nodesHeightSelector);
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
