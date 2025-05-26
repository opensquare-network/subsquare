import { memo, useState } from "react";
import { Button } from "next-common/components/pages/components/gov2/sidebar/tally/styled";
import dynamicPopup from "next-common/lib/dynamic/popup";
import FellowshipVotesProvider from "next-common/context/collectives/fellowshipVotes";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";
import { useReferendumVotingFinishIndexer } from "next-common/context/post/referenda/useReferendumVotingFinishHeight";

const EligibleVotersPopup = dynamicPopup(() => import("./popup"));

function EligibleVoters() {
  const [showEligibleVoters, setShowEligibleVoters] = useState(false);
  const indexer = useReferendumVotingFinishIndexer();

  return (
    <>
      <Button onClick={() => setShowEligibleVoters(true)}>All votes</Button>
      {showEligibleVoters && (
        <MigrationConditionalApiProvider indexer={indexer}>
          <FellowshipVotesProvider>
            <EligibleVotersPopup onClose={() => setShowEligibleVoters(false)} />
          </FellowshipVotesProvider>
        </MigrationConditionalApiProvider>
      )}
    </>
  );
}

export default memo(EligibleVoters);
