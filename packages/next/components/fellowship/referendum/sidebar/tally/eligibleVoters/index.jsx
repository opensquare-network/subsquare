import { memo, useState } from "react";
import { Button } from "components/gov2/sidebar/tally/styled";
import dynamicPopup from "next-common/lib/dynamic/popup";
import FellowshipVotesProvider from "next-common/context/collectives/votes";

const EligibleVotersPopup = dynamicPopup(() => import("./popup"));

function EligibleVoters() {
  const [showEligibleVoters, setShowEligibleVoters] = useState(false);

  return (
    <>
      <Button onClick={() => setShowEligibleVoters(true)}>All votes</Button>
      {showEligibleVoters && (
        <FellowshipVotesProvider>
          <EligibleVotersPopup onClose={() => setShowEligibleVoters(false)} />
        </FellowshipVotesProvider>
      )}
    </>
  );
}

export default memo(EligibleVoters);
