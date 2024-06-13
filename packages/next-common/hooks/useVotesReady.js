import { useDetailType } from "next-common/context/page";
import { votesReadySelector as democracyVotesReadySelector } from "next-common/store/reducers/democracy/votes/selectors";
import { votesReadySelector as referendaVotesReadySelector } from "next-common/store/reducers/referenda/votes/selectors";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export function useVotesReady() {
  const detailType = useDetailType();
  const referendaReady = useSelector(referendaVotesReadySelector);
  const democracyReady = useSelector(democracyVotesReadySelector);

  return useMemo(() => {
    if (detailType === detailPageCategory.GOV2_REFERENDUM) {
      return referendaReady;
    } else if (detailType === detailPageCategory.DEMOCRACY_REFERENDUM) {
      return democracyReady;
    }

    return false;
  }, [detailType, referendaReady, democracyReady]);
}
