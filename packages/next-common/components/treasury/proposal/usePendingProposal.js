import nextApi from "next-common/services/nextApi";
import { useCallback, useEffect, useState } from "react";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { useDispatch, useSelector } from "react-redux";
import {
  pendingProposalsSelector,
  removePendingProposal,
  checkTimesSelector,
  setCheckTimes,
} from "next-common/store/reducers/treasuryProposalSlice";

export default function usePendingProposal({ proposals, setProposals }) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const pendingProposals = useSelector(pendingProposalsSelector);
  const checkTimes = useSelector(checkTimesSelector);

  const pendingReload = checkTimes > 0 && pendingProposals?.length > 0;

  const fetchProposals = useCallback(async () => {
    setTimeout(async () => {
      dispatch(setCheckTimes(checkTimes - 1));

      const { result } = await nextApi.fetch(`treasury/proposals`, {
        page: 1,
        pageSize: proposals.pageSize,
      });
      if (result) {
        for (const proposal of result.items) {
          if (pendingProposals.includes(proposal.proposalIndex)) {
            dispatch(removePendingProposal(proposal.proposalIndex));
          }
        }
        if (proposals.page === 1) {
          if (isMounted.current) {
            setProposals(result);
          }
        }
      }
    }, 5000);
  }, [dispatch, checkTimes, pendingProposals, proposals, isMounted]);

  const [reload, setReload] = useState(false);

  useEffect(() => {
    if (!reload) {
      return;
    }
    setReload(false);
    fetchProposals();
  }, [reload, fetchProposals]);

  useEffect(() => {
    if (!pendingReload) {
      return;
    }
    setReload(true);
  }, [pendingReload, checkTimes]);

  return { pendingReload, pendingProposals };
}
