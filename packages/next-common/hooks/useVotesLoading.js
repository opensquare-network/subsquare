import { useDetailType } from "next-common/context/page";
import { votesLoadingSelector as democracyVotesLoadingSelector } from "next-common/store/reducers/democracy/votes/selectors";
import { votesLoadingSelector as referendaVotesLoadingSelector } from "next-common/store/reducers/referenda/votes/selectors";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export function useVotesLoading() {
  const detailType = useDetailType();
  const referendaLoading = useSelector(referendaVotesLoadingSelector);
  const democracyLoading = useSelector(democracyVotesLoadingSelector);

  return useMemo(() => {
    if (detailType === detailPageCategory.GOV2_REFERENDUM) {
      return referendaLoading;
    } else if (detailType === detailPageCategory.DEMOCRACY_REFERENDUM) {
      return democracyLoading;
    }

    return false;
  }, [detailType, referendaLoading, democracyLoading]);
}
