import { find, flatten, values } from "lodash-es";
import { useDetailType } from "next-common/context/page";
import { allVotesSelector as allDemocracyVotesSelector } from "next-common/store/reducers/democracy/votes/selectors";
import { allNestedVotesSelector as allReferendaNestedVotesSelector } from "next-common/store/reducers/referenda/votes/selectors";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { useCallback } from "react";
import { useSelector } from "react-redux";

export function useAddressVotesData(address) {
  const getAddressVotesData = useGetAddressVotesDataFn();

  return getAddressVotesData(address);
}

export function useGetAddressVotesDataFn() {
  const detailType = useDetailType();

  const allNestedReferendaVotes = useSelector(allReferendaNestedVotesSelector);

  const allDemocracyVotes = useSelector(allDemocracyVotesSelector);

  let votes = [];
  if (detailType === detailPageCategory.GOV2_REFERENDUM) {
    votes = flatten(values(allNestedReferendaVotes));
  } else if (detailType === detailPageCategory.DEMOCRACY_REFERENDUM) {
    votes = allDemocracyVotes;
  }

  const getAddressVotesData = useCallback(
    (address) => {
      return find(votes, { account: address });
    },
    [detailType, votes],
  );

  return getAddressVotesData;
}
