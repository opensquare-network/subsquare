import dynamic from "next/dynamic";
import PrimaryButton from "next-common/lib/button/primary";
import { useState } from "react";

const SystemPlus = dynamic(() => import("@osn/icons/subsquare/SystemPlus"));

const NewTreasuryProposalPopup = dynamic(() => import("./popup"));

export default function NewTreasuryProposalButton() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <PrimaryButton
        small
        icon={
          <SystemPlus className="w-4 h-4 [&_path]:fill-textPrimaryContrast" />
        }
        onClick={() => setShowPopup(true)}
      >
        New Proposal
      </PrimaryButton>
      {showPopup && (
        <NewTreasuryProposalPopup onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}
