import {
  allAyeSelector,
  allNaySelector,
} from "next-common/store/reducers/democracy/votes/selectors";
import { useSelector } from "react-redux";
import VotesBubble from "next-common/components/charts/votesBubble";

export default function DemocracyReferendaVotesBubble() {
  const allAye = useSelector(allAyeSelector);
  const allNay = useSelector(allNaySelector);

  return <VotesBubble allAye={allAye} allNay={allNay} sizeField="votes" />;
}
