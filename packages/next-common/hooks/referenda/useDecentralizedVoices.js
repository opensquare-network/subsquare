import { partition } from "lodash-es";
import { nestedVotesSelector } from "next-common/store/reducers/referenda/votes/selectors";
import { bnSumBy, bnToPercentage } from "next-common/utils/bn";
import { useSelector } from "react-redux";
import { useDecentralizedVoicesVotes } from "./useDecentralizedVoicesVotes";

function bnSumTotalVotes(votes = []) {
  const VOTES_KEY = "totalVotes";
  return bnSumBy(votes, VOTES_KEY);
}

export function useDecentralizedVoices() {
  const dvVotes = useDecentralizedVoicesVotes();
  const dvTotalVotesValue = bnSumTotalVotes(dvVotes);
  const nestedVotes = useSelector(nestedVotesSelector);
  const nestedTotalVotesValue = bnSumTotalVotes(nestedVotes);

  const [abstains, rest] = partition(dvVotes, (v) => v?.isAbstain);
  const [ayes, nays] = partition(rest, (v) => v?.aye);

  const ayeVotes = bnSumTotalVotes(ayes);
  const nayVotes = bnSumTotalVotes(nays);
  const abstainVotes = bnSumTotalVotes(abstains);

  const dvPercentage = bnToPercentage(dvTotalVotesValue, nestedTotalVotesValue);
  const ayePercentage = bnToPercentage(ayeVotes, nestedTotalVotesValue);
  const nayPercentage = bnToPercentage(nayVotes, nestedTotalVotesValue);
  const abstainPercentage = bnToPercentage(abstainVotes, nestedTotalVotesValue);

  return {
    dvVotesValue: dvTotalVotesValue.toString(),
    dvPercentage,
    ayeVotesValue: ayeVotes.toString(),
    ayePercentage,
    nayVotesValue: nayVotes.toString(),
    nayPercentage,
    abstainVotesValue: abstainVotes.toString(),
    abstainPercentage,
  };
}
