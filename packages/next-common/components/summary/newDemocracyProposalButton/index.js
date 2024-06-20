import { useState } from "react";
import NewButton from "../newProposalButton/newButton";
import dynamicPopup from "next-common/lib/dynamic/popup";

const SubmitDemocracyProposalPopup = dynamicPopup(() =>
  import("./submitDemocracyProposalPopup"),
);

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
