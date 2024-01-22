import { useState } from "react";
import SubmitDemocracyProposalPopup from "./submitDemocracyProposalPopup";
import NewButton from "../newProposalButton/newButton";

export default function NewDemocracyProposalButton() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <NewButton setShowPopup={setShowPopup} />
      {showPopup && (
        <SubmitDemocracyProposalPopup onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}
