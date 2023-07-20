import { useState } from "react";
import DemocracyCallsVotesPopup from "./voteCallsPopup";
import SubLink from "next-common/components/styled/subLink";

export default function Calls() {
  const [showVoteCalls, setShowVoteCalls] = useState(false);

  return (
    <>
      <SubLink onClick={() => setShowVoteCalls(true)}>Calls</SubLink>
      {showVoteCalls && (
        <DemocracyCallsVotesPopup setShowVoteList={setShowVoteCalls} />
      )}
    </>
  );
}
