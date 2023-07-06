import { useSelector } from "react-redux";
import VotesCount from "next-common/components/democracy/referendum/votesCount";
import { Header } from "next-common/components/referenda/tally/styled";
import { isLoadingVotesSelector, votesTriggerSelector } from "next-common/store/reducers/referenda/votes/selectors";

export default function LoadingCount({ count, children }) {
  const isLoadingVotes = useSelector(isLoadingVotesSelector);
  const votesTrigger = useSelector(votesTriggerSelector);
  const shouldShow = !isLoadingVotes || votesTrigger > 1;

  return (
    <Header>
      {children}
      {shouldShow ? <VotesCount>{count}</VotesCount> : null}
    </Header>
  );
}
