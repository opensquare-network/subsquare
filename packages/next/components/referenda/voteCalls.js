import { useState } from "react";
import SubLink from "next-common/components/styled/subLink";
import dynamic from "next/dynamic";

const DemocracyCallsVotesPopup = dynamic(
  () => import("next-common/components/democracy/democracyCallsVotesPopup"),
  {
    ssr: false,
  },
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
