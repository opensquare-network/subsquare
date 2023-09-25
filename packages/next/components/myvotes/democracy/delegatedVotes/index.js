// For democracy pallet
import VotesListTitle from "../../common/votesListTitle";
import { useSelector } from "react-redux";
import { myDemocracyDelegatedVotesSelector } from "next-common/store/reducers/myOnChainData/democracy/selectors/delegated";
import ResponsiveDelegatedVotesList from "./responsive";

export default function MyDelegatedVotes() {
  const myDelegatedVotes = useSelector(myDemocracyDelegatedVotesSelector);

  return (
    <>
      <VotesListTitle length={myDelegatedVotes?.length || 0} />
      <ResponsiveDelegatedVotesList />
    </>
  );
}
