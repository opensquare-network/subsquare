import NewButton from "./newButton";
import { useCallback, useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { CreateReferendumStatusProvider } from "next-common/context/createReferendumStatus";

const SubmitProposalPopup = dynamicPopup(() => import("./submitProposalPopup"));
const SubmitStepPopup = dynamicPopup(() => import("./submitStepPopup"));

export default function NewProposalButton() {
  const [showPopup, setShowPopup] = useState(false);
  const [showStatusPopup, setShowStatusPopup] = useState(false);

  const openStatusPopup = useCallback(() => {
    setShowPopup(false);
    setShowStatusPopup(true);
  }, []);

  return (
    <CreateReferendumStatusProvider
      closeInputPopup={() => setShowPopup(false)}
      closeStatusPopup={() => setShowStatusPopup(false)}
      openStatusPopup={openStatusPopup}
    >
      <NewButton setShowPopup={setShowPopup} />
      {showPopup && (
        <SubmitProposalPopup
          onClose={() => setShowPopup(false)}
          setStepPopup={showStatusPopup}
        />
      )}
      {showStatusPopup && (
        <SubmitStepPopup onClose={() => setShowStatusPopup(false)} />
      )}
    </CreateReferendumStatusProvider>
  );
}
