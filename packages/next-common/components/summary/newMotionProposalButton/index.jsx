import { useState } from "react";
import NewButton from "../newProposalButton/newButton";
import PromoteMotionPopup from "./promoteMotionPopup";

export default function NewMotionProposalButton() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <NewButton setShowPopup={setShowPopup} />

      {showPopup && (
        <PromoteMotionPopup
          onClose={() => {
            setShowPopup(false);
          }}
        />
      )}
    </>
  );
}
