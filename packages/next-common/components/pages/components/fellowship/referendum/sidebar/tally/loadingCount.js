import { useSelector } from "react-redux";
import VotesCount from "next-common/components/democracy/referendum/votesCount";
import { isLoadingFellowshipVotesSelector } from "next-common/store/reducers/fellowship/votes";
import { Header } from "next-common/components/referenda/tally/styled";

export default function LoadingCount({ count, children }) {
  const isLoadingVotes = useSelector(isLoadingFellowshipVotesSelector);

  return (
    <Header>
      {children}
      {!isLoadingVotes ? <VotesCount>{count}</VotesCount> : null}
    </Header>
  );
}
