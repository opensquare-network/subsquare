import { useState } from "react";
import AllVotesPopup from "./allVotesPopup";
import partition from "lodash.partition";
import { Button } from "components/gov2/sidebar/tally/styled";

export default function AllVotes({ votes, isLoadingVotes }) {
  const [showAllVotes, setShowAllVotes] = useState(false);
  const [allAye = [], allNay = []] = partition(votes, (v) => v.isAye);

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
