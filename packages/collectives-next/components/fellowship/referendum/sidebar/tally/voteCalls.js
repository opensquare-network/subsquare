import { useState } from "react";
import { Button } from "components/gov2/sidebar/tally/styled";
import dynamicPopup from "next-common/lib/dynamic/popup";

const FellowshipCallsVotesPopup = dynamicPopup(() =>
  import("./fellowshipCallsVotesPopup"),
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
