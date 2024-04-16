import { nestedVotesSelector } from "next-common/store/reducers/referenda/votes/selectors";
import { bnSumBy, bnToPercentage } from "next-common/utils/bn";
import { useSelector } from "react-redux";
import { useDecentralizedVoicesValue } from "./useDecentralizedVoicesValue";

export function useDecentralizedVoicesPercentage() {
  const nestedVotes = useSelector(nestedVotesSelector);
  const nestedTotalVotesValue = bnSumBy(nestedVotes, "totalVotes");

  const { dvVotesValue, abstainVotesValue, nayVotesValue, ayeVotesValue } =
    useDecentralizedVoicesValue();

  const dvPercentage = bnToPercentage(dvVotesValue, nestedTotalVotesValue);
  const ayePercentage = bnToPercentage(ayeVotesValue, nestedTotalVotesValue);
  const nayPercentage = bnToPercentage(nayVotesValue, nestedTotalVotesValue);
  const abstainPercentage = bnToPercentage(
    abstainVotesValue,
    nestedTotalVotesValue,
  );

  return {
    dvPercentage,
    ayePercentage,
    nayPercentage,
    abstainPercentage,
  };
}
