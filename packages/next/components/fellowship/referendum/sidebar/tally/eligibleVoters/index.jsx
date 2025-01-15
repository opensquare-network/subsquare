import { memo, useState } from "react";
import { Button } from "components/gov2/sidebar/tally/styled";
import dynamicPopup from "next-common/lib/dynamic/popup";

const EligibleVotersPopup = dynamicPopup(() => import("./popup"));

function EligibleVoters() {
  const [showEligibleVoters, setShowEligibleVoters] = useState(false);

  return (
    <>
      <Button onClick={() => setShowEligibleVoters(true)}>All votes</Button>
      {showEligibleVoters && (
        <EligibleVotersPopup onClose={() => setShowEligibleVoters(false)} />
      )}
    </>
  );
}

export default memo(EligibleVoters);
