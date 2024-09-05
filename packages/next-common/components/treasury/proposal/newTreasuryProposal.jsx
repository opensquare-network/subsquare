import { useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import PrimaryButton from "next-common/lib/button/primary";
import NewTreasuryProposalButton from "./newTreasuryProposalButton";
import { getEventData } from "next-common/utils/sendTransaction";
import {
  useProposalsSection,
  useProposalsParams,
} from "next-common/context/treasury/proposals";

const SystemPlus = dynamic(() => import("@osn/icons/subsquare/SystemPlus"));

const NewTreasuryProposalPopup = dynamic(() => import("./popup"));

function NewTreasuryProposalButton({ treasuryPallet, onInBlock }) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <PrimaryButton
        size="small"
        icon={
          <SystemPlus className="w-4 h-4 [&_path]:fill-textPrimaryContrast" />
        }
        onClick={() => setShowPopup(true)}
      >
        New Proposal
      </PrimaryButton>
      {showPopup && (
        <NewTreasuryProposalPopup
          treasuryPallet={treasuryPallet}
          onInBlock={onInBlock}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}

export default function NewTreasuryProposal() {
  const router = useRouter();
  const section = useProposalsSection();
  const { proposalsUrl } = useProposalsParams();

  return (
    <NewTreasuryProposalButton
      treasuryPallet={section}
      onInBlock={(events) => {
        const eventData = getEventData(events, section, "Proposed");
        if (!eventData) {
          return;
        }
        const [proposalIndex] = eventData;
        router.push(`${proposalsUrl}/${proposalIndex}`);
      }}
    />
  );
}
