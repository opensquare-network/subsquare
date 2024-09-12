import Tooltip from "next-common/components/tooltip";
import dynamicPopup from "next-common/lib/dynamic/popup";
import useIsCouncilMember from "next-common/utils/hooks/useIsCouncilMember";
import { useState } from "react";
import NewButton from "../newProposalButton/newButton";

const NewCouncilMotionProposalPopup = dynamicPopup(() =>
  import("./newCouncilMotionProposalPopup"),
);

export default function NewCouncilMotionProposalButton() {
  const [showPopup, setShowPopup] = useState(false);
  const isCouncilMember = useIsCouncilMember();

  return (
    <>
      <Tooltip
        content={
          !isCouncilMember ? "Only council members can create proposals" : null
        }
      >
        <NewButton setShowPopup={setShowPopup} disabled={!isCouncilMember} />
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
