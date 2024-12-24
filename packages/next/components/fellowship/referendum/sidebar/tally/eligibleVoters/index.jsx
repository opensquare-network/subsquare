import { useState } from "react";
import { Button } from "components/gov2/sidebar/tally/styled";
import dynamicPopup from "next-common/lib/dynamic/popup";

const EligibleVotersPopup = dynamicPopup(() => import("./popup"));

export default function EligibleVoters() {
  const [showEligibleVoters, setShowEligibleVoters] = useState(false);

  return (
    <>
      <Button onClick={() => setShowEligibleVoters(true)}>
        Eligible Voters
      </Button>
      {showEligibleVoters && (
        <EligibleVotersPopup setShowEligibleVoters={setShowEligibleVoters} />
      )}
    </>
  );
}
