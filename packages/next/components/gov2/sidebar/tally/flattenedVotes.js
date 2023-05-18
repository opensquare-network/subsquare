import { useState } from "react";
import { Button } from "./styled";
import FlattenedVotesPopup from "./flattenedVotesPopup";
import { useSelector } from "react-redux";
import {
  isLoadingVotesSelector,
  votesSelector,
} from "next-common/store/reducers/gov2ReferendumSlice";

export default function FlattenedVotes() {
  const [showFlattenedVotes, setShowFlattenedVotes] = useState(false);
  const isLoadingVotes = useSelector(isLoadingVotesSelector);
  const {
    allAye = [],
    allNay = [],
    allAbstain = [],
  } = useSelector(votesSelector);

  return (
    <>
      <Button onClick={() => setShowFlattenedVotes(true)}>Flattened</Button>
      {showFlattenedVotes && (
        <FlattenedVotesPopup
          setShowVoteList={setShowFlattenedVotes}
          allAye={allAye}
          allNay={allNay}
          allAbstain={allAbstain}
          isLoadingVotes={isLoadingVotes}
        />
      )}
    </>
  );
}
