import { detailMultiTabsVotesBubbleView } from "next-common/store/reducers/detailSlice";
import {
  allNestedVotesSelector,
  flattenVotesSelector,
} from "next-common/store/reducers/referenda/votes/selectors";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import VotesBubble from "../../charts/votesBubble";

export default function Gov2ReferendaVotesBubble() {
  const allFlattenedVotes = useSelector(flattenVotesSelector);
  const allNestedVotes = useSelector(allNestedVotesSelector);

  const [votesObj, setVotesObj] = useState({});
  const [sizeField, setSizeField] = useState("votes");
  const viewMode = useSelector(detailMultiTabsVotesBubbleView);

  useEffect(() => {
    if (viewMode === "flattened") {
      setVotesObj(allFlattenedVotes);
      setSizeField("votes");
    } else {
      setVotesObj(allNestedVotes);
      setSizeField("totalVotes");
    }
  }, [viewMode]);

  return (
    <VotesBubble
      allAye={votesObj.allAye}
      allNay={votesObj.allNay}
      allAbstain={votesObj.allAbstain}
      sizeField={sizeField}
    />
  );
}
