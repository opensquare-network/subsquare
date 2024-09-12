import Tooltip from "next-common/components/tooltip";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useState } from "react";
import NewButton from "../newProposalButton/newButton";
import useIsCollectiveMember from "next-common/utils/hooks/collectives/useIsCollectiveMember";
import { useCollectivePallet } from "next-common/context/collective";

const NewCouncilMotionProposalPopup = dynamicPopup(() =>
  import("./newCouncilMotionProposalPopup"),
);

export default function NewCouncilMotionProposalButton() {
  const [showPopup, setShowPopup] = useState(false);
  const pallet = useCollectivePallet();
  const { isMember } = useIsCollectiveMember(pallet);

  return (
    <>
      <Tooltip
        content={
          !isMember ? "Only collective members can create proposals" : null
        }
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
