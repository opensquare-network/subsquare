import { useState } from "react";
import { Button } from "./styled";
import AllVotesPopup from "next-common/components/democracy/allVotesPopup";
import { useSelector } from "react-redux";
import {
  isLoadingVotesSelector,
  votesSelector,
} from "next-common/store/reducers/gov2ReferendumSlice";

export default function AllVotes() {
  const [showAllVotes, setShowAllVotes] = useState(false);
  const isLoadingVotes = useSelector(isLoadingVotesSelector);
  const { allAye = [], allNay = [] } = useSelector(votesSelector);

  return (
    <>
      <Button onClick={() => setShowAllVotes(true)}>All Votes</Button>
      {showAllVotes && (
        <AllVotesPopup
          setShowVoteList={setShowAllVotes}
          allAye={allAye}
          allNay={allNay}
          isLoadingVotes={isLoadingVotes}
        />
      )}
    </>
  );
}
