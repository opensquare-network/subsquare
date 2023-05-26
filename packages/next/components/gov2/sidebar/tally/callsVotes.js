import { Button } from "./styled";
import { useState } from "react";
import CallsVotesPopup from "../callsVotesPopup";

export default function CallsVotes() {
  const [showCallsVotes, setShowCallsVotes] = useState(false);

  return (
    <>
      <Button onClick={() => setShowCallsVotes(true)}>Calls</Button>
      {showCallsVotes && (
        <CallsVotesPopup setShowVoteList={setShowCallsVotes} />
      )}
    </>
  );
}
