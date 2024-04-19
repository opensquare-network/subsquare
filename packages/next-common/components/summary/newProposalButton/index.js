import NewButton from "./newButton";
import SubmitProposalPopup from "./submitProposalPopup";
import { useState } from "react";

export default function NewProposalButton({ module }) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <NewButton setShowPopup={setShowPopup} />
      {showPopup && (
        <SubmitProposalPopup
          onClose={() => setShowPopup(false)}
          module={module}
        />
      )}
    </>
  );
}
