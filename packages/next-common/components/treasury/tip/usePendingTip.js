import nextApi from "next-common/services/nextApi";
import { useCallback, useEffect } from "react";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { useDispatch, useSelector } from "react-redux";
import {
  pendingTipsSelector,
  removePendingTip,
  checkTimesSelector,
  setCheckTimes,
} from "next-common/store/reducers/tipSlice";

const fiveSeconds = 5000;

export default function usePendingTip({ tips, setTips }) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const pendingTips = useSelector(pendingTipsSelector);
  const checkTimes = useSelector(checkTimesSelector);

  const fetchTips = useCallback(async () => {
    const { result } = await nextApi.fetch(`treasury/tips`, {
      page: 1,
      pageSize: tips.pageSize,
    });
    if (result) {
      for (const tip of result.items) {
        if (pendingTips.includes(tip.hash)) {
          dispatch(removePendingTip(tip.hash));
        }
      }

      if (tips.page === 1 && isMounted.current) {
        setTips(result);
      }
    }
  }, [dispatch, pendingTips, tips, setTips, isMounted]);

  useEffect(() => {
    if (checkTimes <= 0 || (pendingTips || []).length <= 0) {
      return;
    }

    setTimeout(() => {
      dispatch(setCheckTimes(checkTimes - 1));
    }, fiveSeconds);

    fetchTips().then(() => {
      if (checkTimes > 1) {
        console.log(`Will fetch pending tips again in 5 secs`);
      }
    });
  }, [checkTimes, pendingTips, dispatch, fetchTips]);

  return {
    pendingReload: checkTimes > 0 && pendingTips?.length > 0,
    pendingTips,
  };
}
