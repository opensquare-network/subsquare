import NewButton from "./newButton";
import SubmitProposalPopup from "./submitProposalPopup";
import { useState } from "react";

export default function NewProposalButton() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <NewButton setShowPopup={setShowPopup} />
      {showPopup && <SubmitProposalPopup onClose={() => setShowPopup(false)} />}
    </>
  );
}
