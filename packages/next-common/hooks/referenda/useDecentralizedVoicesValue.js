import { partition } from "lodash-es";
import { bnSumBy } from "next-common/utils/bn";
import { useDecentralizedVoicesVotes } from "./useDecentralizedVoicesVotes";

function bnSumTotalVotes(votes = []) {
  const VOTES_KEY = "totalVotes";
  return bnSumBy(votes, VOTES_KEY);
}

export function useDecentralizedVoicesValue() {
  const dvVotes = useDecentralizedVoicesVotes();
  const dvTotalVotesValue = bnSumTotalVotes(dvVotes);

  const [abstains, rest] = partition(dvVotes, (v) => v?.isAbstain);
  const [ayes, nays] = partition(rest, (v) => v?.aye);

  const ayeVotes = bnSumTotalVotes(ayes);
  const nayVotes = bnSumTotalVotes(nays);
  const abstainVotes = bnSumTotalVotes(abstains);

  return {
    dvVotesValue: dvTotalVotesValue.toString(),
    ayeVotesValue: ayeVotes.toString(),
    nayVotesValue: nayVotes.toString(),
    abstainVotesValue: abstainVotes.toString(),
  };
}
