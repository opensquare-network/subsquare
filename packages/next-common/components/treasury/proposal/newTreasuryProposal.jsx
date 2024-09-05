import { useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import PrimaryButton from "next-common/lib/button/primary";
import { getEventData } from "next-common/utils/sendTransaction";
import {
  useTreasuryPallet,
  useTreasuryProposalListUrl,
} from "next-common/context/treasury";

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
  const pallet = useTreasuryPallet();
  const treasuryProposalListUrl = useTreasuryProposalListUrl(pallet);

  return (
    <NewTreasuryProposalButton
      treasuryPallet={pallet}
      onInBlock={(events) => {
        const eventData = getEventData(events, pallet, "Proposed");
        if (!eventData) {
          return;
        }
        const [proposalIndex] = eventData;
        router.push(`${treasuryProposalListUrl}/${proposalIndex}`);
      }}
    />
  );
}
