import { useSelector } from "react-redux";
import myDemocracyVotesSelector from "next-common/store/reducers/myOnChainData/democracy/selectors/votes";
import VotesListTitle from "../../common/votesListTitle";
import ResponsiveDemocracyVotes from "./responsive";
import WithAllVotesLink from "../../common/withAllVotesLink";

export default function MyDemocracyVotesList() {
  const myDemocracyVotes = useSelector(myDemocracyVotesSelector);

  return (
    <>
      <WithAllVotesLink>
        <VotesListTitle length={myDemocracyVotes?.length || 0} />
      </WithAllVotesLink>
      <ResponsiveDemocracyVotes />
    </>
  );
}
