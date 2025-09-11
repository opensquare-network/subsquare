import { find } from "lodash-es";
import { useDetailType } from "next-common/context/page";
import { allVotesSelector as allDemocracyVotesSelector } from "next-common/store/reducers/democracy/votes/selectors";
import {
  allNestedVotesSelector as allReferendaNestedVotesSelector,
  allVotesSelector as allReferendaVotesSelector,
} from "next-common/store/reducers/referenda/votes/selectors";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { useCallback } from "react";
import { useSelector } from "react-redux";

export function useGetAddressVotesDataFn() {
  const detailType = useDetailType();

  const allNestedReferendaVotes = useSelector(allReferendaNestedVotesSelector);
  const allReferendaVotes = useSelector(allReferendaVotesSelector);

  const allDemocracyVotes = useSelector(allDemocracyVotesSelector);

  return useCallback(
    (address) => {
      if (detailType === detailPageCategory.GOV2_REFERENDUM) {
        const foundNestedVote = find(allNestedReferendaVotes, {
          account: address,
        });
        if (foundNestedVote) {
          return foundNestedVote;
        }

        return find(allReferendaVotes, { account: address });
      } else if (detailType === detailPageCategory.DEMOCRACY_REFERENDUM) {
        return find(allDemocracyVotes, { account: address });
      }

      return null;
    },
    [detailType, allNestedReferendaVotes, allReferendaVotes, allDemocracyVotes],
  );
}
