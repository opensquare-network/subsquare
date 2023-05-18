import {
  isLoadingVotesSelector,
  votesSelector,
} from "next-common/store/reducers/gov2ReferendumSlice";
import { useState } from "react";
import { useSelector } from "react-redux";
import NestedVotesPopup from "./nestedVotesPopup";
import { Button } from "./styled";

export default function NestedVotes() {
  const [showNestedVotes, setShowNestedVotes] = useState(false);
  const isLoadingVotes = useSelector(isLoadingVotesSelector);
  const {
    allAye = [],
    allNay = [],
    allAbstain = [],
  } = useSelector(votesSelector);

  return (
    <>
      <Button onClick={() => setShowNestedVotes(true)}>Nested</Button>

      {showNestedVotes && (
        <NestedVotesPopup
          allAye={allAye}
          allNay={allNay}
          allAbstain={allAbstain}
          setShowVoteList={setShowNestedVotes}
          isLoadingVotes={isLoadingVotes}
        />
      )}
    </>
  );
}
