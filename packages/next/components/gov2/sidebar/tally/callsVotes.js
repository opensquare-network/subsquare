import { Button } from "./styled";
import { useState } from "react";
import dynamic from "next/dynamic";

const OpenGovCallsVotesPopup = dynamic(
  () => import("./openGovCallsVotesPopup"),
  {
    ssr: false,
  },
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
