import { Button } from "./styled";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";

const OpenGovCallsVotesPopup = dynamicPopup(() =>
  import("./openGovCallsVotesPopup"),
);

export default function CallsVotes() {
  const [showCallsVotes, setShowCallsVotes] = useState(false);

  return (
    <>
      <Button onClick={() => setShowCallsVotes(true)}>Calls</Button>
      {showCallsVotes && (
        <OpenGovCallsVotesPopup setShowVoteList={setShowCallsVotes} />
      )}
    </>
  );
}
