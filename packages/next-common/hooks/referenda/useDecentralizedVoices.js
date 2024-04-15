import BigNumber from "bignumber.js";
import { filter, flatten, map } from "lodash-es";
import { partition } from "lodash-es";
import { allNestedVotesSelector } from "next-common/store/reducers/referenda/votes/selectors";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useDecentralizedVoicesVotes } from "./useDecentralizedVoicesVotes";

function bnSumTotalVotes(votes = []) {
  let res = BigNumber(0);
  const sum = BigNumber.sum(...map(votes, "totalVotes"));

  if (!sum.isNaN()) {
    res = BigNumber(sum);
  }

  return res;
}

/**
 * @param {BigNumber} numerator
 * @param {BigNumber} denominator
 */
function bnToPercentage(numerator, denominator) {
  return denominator.isZero()
    ? 0
    : numerator.div(denominator).times(100).toNumber();
}

export function useDecentralizedVoices() {
  const dvVotes = useDecentralizedVoicesVotes();
  const allDvVotes = bnSumTotalVotes(filter(dvVotes, "totalVotes"));

  const { allAye, allNay, allAbstain } = useSelector(allNestedVotesSelector);
  const allNestedVotes = useMemo(
    () => flatten([allAye, allNay, allAbstain]),
    [allAye, allNay, allAbstain],
  );

  const allTotalVotes = bnSumTotalVotes(allNestedVotes);

  const [abstains, rest] = partition(dvVotes, (v) => v?.isAbstain);
  const [ayes, nays] = partition(rest, (v) => v?.aye);

  const ayeVotes = bnSumTotalVotes(ayes);
  const nayVotes = bnSumTotalVotes(nays);
  const abstainVotes = bnSumTotalVotes(abstains);

  const dvPercentage = bnToPercentage(allDvVotes, allTotalVotes);
  const ayePercentage = bnToPercentage(ayeVotes, allTotalVotes);
  const nayPercentage = bnToPercentage(nayVotes, allTotalVotes);
  const abstainPercentage = bnToPercentage(abstainVotes, allTotalVotes);

  return {
    dvVotesValue: allDvVotes.toString(),
    dvPercentage,
    ayeVotesValue: ayeVotes.toString(),
    ayePercentage,
    nayVotesValue: nayVotes.toString(),
    nayPercentage,
    abstainVotesValue: abstainVotes.toString(),
    abstainPercentage,
  };
}
