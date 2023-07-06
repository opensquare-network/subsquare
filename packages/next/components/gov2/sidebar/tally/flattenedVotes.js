import { useState } from "react";
import { Button } from "./styled";
import FlattenedVotesPopup from "./flattenedVotesPopup";
import { useSelector } from "react-redux";
import { flattenVotesSelector, isLoadingVotesSelector } from "next-common/store/reducers/referenda/votes/selectors";

export default function FlattenedVotes() {
  const [showFlattenedVotes, setShowFlattenedVotes] = useState(false);
  const isLoadingVotes = useSelector(isLoadingVotesSelector);
  const {
    allAye = [],
    allNay = [],
    allAbstain = [],
  } = useSelector(flattenVotesSelector);

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
