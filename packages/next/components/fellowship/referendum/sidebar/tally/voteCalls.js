import { useState } from "react";
import { Button } from "components/gov2/sidebar/tally/styled";
import FellowshipCallsVotesPopup from "./fellowshipCallsVotesPopup";

export default function Calls() {
  const [showVoteCalls, setShowVoteCalls] = useState(false);

  return (
    <>
      <Button onClick={() => setShowVoteCalls(true)}>Calls</Button>
      {showVoteCalls && (
        <FellowshipCallsVotesPopup
          setShowVoteList={setShowVoteCalls}
        />
      )}
    </>
  );
}
