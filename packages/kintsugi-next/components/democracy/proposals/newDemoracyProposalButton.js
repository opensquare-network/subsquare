import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import NewButton from "next-common/components/summary/newProposalButton/newButton";

const NewDemocracyProposalPopup = dynamicPopup(() =>
  import("./newDemocracyProposalPopup"),
);

export default function NewDemocracyProposalButton() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <NewButton setShowPopup={setShowPopup} />
      {showPopup && (
        <NewDemocracyProposalPopup onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}
