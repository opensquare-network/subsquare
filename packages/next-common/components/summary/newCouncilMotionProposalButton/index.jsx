import { useState } from "react";
import NewButton from "../newProposalButton/newButton";
import NewCouncilMotionProposalPopup from "./newCouncilMotionProposalPopup";

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
