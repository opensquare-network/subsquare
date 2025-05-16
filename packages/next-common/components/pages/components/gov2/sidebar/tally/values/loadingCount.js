import { useSelector } from "react-redux";
import VotesCount from "next-common/components/democracy/referendum/votesCount";
import { Header } from "next-common/components/referenda/tally/styled";
import { showVotesNumberSelector } from "next-common/store/reducers/referenda/votes/selectors";

export default function LoadingCount({ count, children }) {
  const shouldShow = useSelector(showVotesNumberSelector);

  return (
    <Header>
      {children}
      {shouldShow ? <VotesCount>{count}</VotesCount> : null}
    </Header>
  );
}
