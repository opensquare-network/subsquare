import { useState } from "react";
import NewButton from "../newProposalButton/newButton";
import dynamic from "next/dynamic";

const SubmitDemocracyProposalPopup = dynamic(
  () => import("./submitDemocracyProposalPopup"),
  {
    ssr: false,
  },
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
