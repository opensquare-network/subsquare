import {
  allAyeSelector,
  allNaySelector,
  votesLoadingSelector,
} from "next-common/store/reducers/democracy/votes/selectors";
import { useSelector } from "react-redux";
import VotesBubble from "next-common/components/charts/votesBubble";

export default function DemocracyReferendaVotesBubble() {
  const allAye = useSelector(allAyeSelector);
  const allNay = useSelector(allNaySelector);
  const loading = useSelector(votesLoadingSelector);

  return (
    <VotesBubble
      allAye={allAye}
      allNay={allNay}
      loading={loading}
      sizeField="votes"
    />
  );
}
