import { allNestedVotesSelector } from "next-common/store/reducers/referenda/votes/selectors";
import { bnSumBy, bnToPercentage } from "next-common/utils/bn";
import { useSelector } from "react-redux";
import { useDecentralizedVoicesValue } from "./useDecentralizedVoicesValue";

export function useDecentralizedVoicesPercentage() {
  const allNestedVotes = useSelector(allNestedVotesSelector);
  const allNestedTotalVotesValue = bnSumBy(allNestedVotes, "totalVotes");

  const { dvVotesValue, abstainVotesValue, nayVotesValue, ayeVotesValue } =
    useDecentralizedVoicesValue();

  const dvPercentage = bnToPercentage(dvVotesValue, allNestedTotalVotesValue);
  const ayePercentage = bnToPercentage(ayeVotesValue, allNestedTotalVotesValue);
  const nayPercentage = bnToPercentage(nayVotesValue, allNestedTotalVotesValue);
  const abstainPercentage = bnToPercentage(
    abstainVotesValue,
    allNestedTotalVotesValue,
  );

  return {
    dvPercentage,
    ayePercentage,
    nayPercentage,
    abstainPercentage,
  };
}
