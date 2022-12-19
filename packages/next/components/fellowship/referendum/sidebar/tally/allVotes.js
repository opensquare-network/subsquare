import { useState } from "react";
import AllVotesPopup from "./allVotesPopup";
import styled from "styled-components";
import partition from "lodash.partition";

const Button = styled.div`
  cursor: pointer;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: #6848ff;
`;

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
