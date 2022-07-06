import nextApi from "next-common/services/nextApi";
import { useCallback, useEffect, useState } from "react";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { useDispatch, useSelector } from "react-redux";
import {
  pendingTipsSelector,
  removePendingTip,
  checkTimesSelector,
  setCheckTimes,
} from "next-common/store/reducers/tipSlice";

export default function usePendingTip({ tips, setTips }) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const pendingTips = useSelector(pendingTipsSelector);
  const checkTimes = useSelector(checkTimesSelector);

  const pendingReload = checkTimes > 0 && pendingTips?.length > 0;

  const fetchTips = useCallback(async () => {
    setTimeout(async () => {
      dispatch(setCheckTimes(checkTimes - 1));

      const { result } = await nextApi.fetch(`treasury/tips`, {
        page: 1,
        pageSize: tips.pageSize,
      });
      if (result) {
        for (const tip of result.items) {
          if (pendingTips.includes(tip.tipHash)) {
            dispatch(removePendingTip(tip.tipHash));
          }
        }
        if (tips.page === 1) {
          if (isMounted.current) {
            setTips(result);
          }
        }
      }
    }, 5000);
  }, [dispatch, checkTimes, pendingTips, tips, setTips, isMounted]);

  const [reload, setReload] = useState(false);

  useEffect(() => {
    if (!reload) {
      return;
    }
    setReload(false);
    fetchTips();
  }, [reload, fetchTips]);

  useEffect(() => {
    if (!pendingReload) {
      return;
    }
    setReload(true);
  }, [pendingReload, checkTimes]);

  return { pendingReload, pendingTips };
}
