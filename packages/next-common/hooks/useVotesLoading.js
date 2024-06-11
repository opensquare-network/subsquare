import { useDetailType } from "next-common/context/page";
import { votesLoadingSelector as democracyVotesLoadingSelector } from "next-common/store/reducers/democracy/votes/selectors";
import { votesLoadingSelector as referendaVotesLoadingSelector } from "next-common/store/reducers/referenda/votes/selectors";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { useSelector } from "react-redux";

export function useVotesLoading() {
  const detailType = useDetailType();
  const referendaLoading = useSelector(referendaVotesLoadingSelector);
  const democracyLoading = useSelector(democracyVotesLoadingSelector);

  let loading;
  if (detailType === detailPageCategory.GOV2_REFERENDUM) {
    loading = referendaLoading;
  } else if (detailType === detailPageCategory.DEMOCRACY_REFERENDUM) {
    loading = democracyLoading;
  }

  return loading;
}
