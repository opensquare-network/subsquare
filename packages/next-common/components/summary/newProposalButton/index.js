import NewButton from "./newButton";
import { useState } from "react";
import dynamic from "next/dynamic";

const SubmitProposalPopup = dynamic(() => import("./submitProposalPopup"), {
  ssr: false,
});

export default function NewProposalButton() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <NewButton setShowPopup={setShowPopup} />
      {showPopup && <SubmitProposalPopup onClose={() => setShowPopup(false)} />}
    </>
  );
}
