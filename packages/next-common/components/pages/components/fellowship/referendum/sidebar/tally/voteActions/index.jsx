import { Button } from "next-common/components/pages/components/gov2/sidebar/tally/styled";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import Tooltip from "next-common/components/tooltip";

const FellowshipVoteActionsPopup = dynamicPopup(() => import("./popup"));

export default function VoteActions() {
  const [showVoteActions, setShowVoteActions] = useState(false);

  return (
    <>
      <Tooltip
        contentClassName="max-w-[240px]"
        content="User actions that affected the tally"
      >
        <Button onClick={() => setShowVoteActions(true)}>Actions</Button>
      </Tooltip>
      {showVoteActions && (
        <FellowshipVoteActionsPopup setShowVoteActions={setShowVoteActions} />
      )}
    </>
  );
}
