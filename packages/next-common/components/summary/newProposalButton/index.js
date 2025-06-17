import NewButton from "./newButton";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
const SubmitProposalPopup = dynamicPopup(() => import("./submitProposalPopup"));

export default function NewProposalButton() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <NewButton setShowPopup={setShowPopup} />
      {showPopup && <SubmitProposalPopup onClose={() => setShowPopup(false)} />}
    </>
  );
}
