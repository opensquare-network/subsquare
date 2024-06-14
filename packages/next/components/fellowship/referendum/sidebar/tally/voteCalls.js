import { useState } from "react";
import { Button } from "components/gov2/sidebar/tally/styled";
import dynamic from "next/dynamic";

const FellowshipCallsVotesPopup = dynamic(
  () => import("./fellowshipCallsVotesPopup"),
  {
    ssr: false,
  },
);

export default function Calls() {
  const [showVoteCalls, setShowVoteCalls] = useState(false);

  return (
    <>
      <Button onClick={() => setShowVoteCalls(true)}>Calls</Button>
      {showVoteCalls && (
        <FellowshipCallsVotesPopup setShowVoteList={setShowVoteCalls} />
      )}
    </>
  );
}
