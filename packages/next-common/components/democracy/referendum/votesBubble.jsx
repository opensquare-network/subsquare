import {
  nestedVotesSelector,
  flattenVotesSelector,
  votesLoadingSelector,
} from "next-common/store/reducers/democracy/votes/selectors";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import VotesBubble from "../../charts/votesBubble";
import { useVotesBubbleView } from "next-common/components/detail/detailMultiTabs/votesBubbleViewTabs";

export default function DemocracyReferendaVotesBubble() {
  const flattenVotes = useSelector(flattenVotesSelector);
  const nestedVotes = useSelector(nestedVotesSelector);
  const loading = useSelector(votesLoadingSelector);

  const [votesObj, setVotesObj] = useState({});
  const [sizeField, setSizeField] = useState("votes");
  const [viewMode] = useVotesBubbleView();

  useEffect(() => {
    if (viewMode === "flattened") {
      setVotesObj(flattenVotes);
      setSizeField("votes");
    } else {
      setVotesObj(nestedVotes);
      setSizeField("totalVotes");
    }
  }, [viewMode, flattenVotes, nestedVotes]);

  return (
    <VotesBubble
      allAye={votesObj.allAye}
      allNay={votesObj.allNay}
      allAbstain={votesObj.allAbstain}
      sizeField={sizeField}
      loading={loading}
    />
  );
}
