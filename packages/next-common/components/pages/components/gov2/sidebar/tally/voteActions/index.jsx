import { Button } from "../styled";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import Tooltip from "next-common/components/tooltip";

const OpenGovVoteActionsPopup = dynamicPopup(() => import("./popup"));

export default function VotesActions() {
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
        <OpenGovVoteActionsPopup setShowVoteActions={setShowVoteActions} />
      )}
    </>
  );
}
