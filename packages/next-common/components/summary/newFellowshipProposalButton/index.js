import NewButton from "../newProposalButton/newButton";
import SubmitFellowshipProposalPopup from "./submitProposalPopup";
import { useState } from "react";

export default function NewFellowshipProposalButton({ module }) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <NewButton setShowPopup={setShowPopup} />
      {showPopup && (
        <SubmitFellowshipProposalPopup
          onClose={() => setShowPopup(false)}
          module={module}
        />
      )}
    </>
  );
}
