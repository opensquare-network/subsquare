import { Header } from "./styled";
import { useSelector } from "react-redux";
import { isLoadingVotesSelector } from "next-common/store/reducers/gov2ReferendumSlice";
import VotesCount from "next-common/components/democracy/referendum/votesCount";

export default function LoadingCount({ count, children }) {
  const isLoadingVotes = useSelector(isLoadingVotesSelector);

  return (
    <Header>
      {children}
      {!isLoadingVotes ? <VotesCount>{count}</VotesCount> : null}
    </Header>
  );
}
