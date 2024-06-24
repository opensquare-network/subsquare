import { useState } from "react";
import SubLink from "next-common/components/styled/subLink";
import dynamicPopup from "next-common/lib/dynamic/popup";

const DemocracyCallsVotesPopup = dynamicPopup(() =>
  import("next-common/components/democracy/democracyCallsVotesPopup"),
);

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
