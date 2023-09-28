import { useSelector } from "react-redux";
import myReferendaVotesSelector from "next-common/store/reducers/myOnChainData/referenda/selectors/votes";
import VotesListTitle from "../../common/votesListTitle";
import ResponsiveReferendaVotes from "./responsive";

export default function MyReferendaVotes() {
  const referendaVotes = useSelector(myReferendaVotesSelector);

  return (
    <>
      <VotesListTitle length={referendaVotes?.length || 0} />
      <ResponsiveReferendaVotes />
    </>
  );
}
