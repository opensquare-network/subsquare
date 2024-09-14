import Tooltip from "next-common/components/tooltip";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useState } from "react";
import NewButton from "../newProposalButton/newButton";
import useIsCollectiveMember from "next-common/utils/hooks/collectives/useIsCollectiveMember";

const NewCouncilMotionProposalPopup = dynamicPopup(() =>
  import("./newCouncilMotionProposalPopup"),
);

export default function NewCouncilMotionProposalButton() {
  const [showPopup, setShowPopup] = useState(false);
  const { isMember } = useIsCollectiveMember();

  return (
    <>
      <Tooltip
        content={!isMember ? "Only council members can create proposal" : null}
      >
        <NewButton setShowPopup={setShowPopup} disabled={!isMember} />
      </Tooltip>

      {showPopup && (
        <NewCouncilMotionProposalPopup
          onClose={() => {
            setShowPopup(false);
          }}
        />
      )}
    </>
  );
}
