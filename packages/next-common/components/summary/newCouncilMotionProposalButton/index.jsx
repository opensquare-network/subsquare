import dynamicPopup from "next-common/lib/dynamic/popup";
import { useState } from "react";
import NewButton from "../newProposalButton/newButton";

const NewCouncilMotionProposalPopup = dynamicPopup(() =>
  import("./newCouncilMotionProposalPopup"),
);

export default function NewCouncilMotionProposalButton() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <NewButton setShowPopup={setShowPopup} />
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
