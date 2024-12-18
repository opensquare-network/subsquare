import Popup from "next-common/components/popup/wrapper/Popup";
import TreasuryProposalPopupContent from "./common/treasuryProposalPopupContent";
import { usePopupParams } from "next-common/components/popupWithSigner/context";

export default function ApproveTreasuryProposalInnerPopup({ isMember }) {
  const { onClose } = usePopupParams();
  return (
    <Popup title="Approve Treasury Proposal" onClose={onClose}>
      <TreasuryProposalPopupContent
        onClose={onClose}
        isMember={isMember}
        treasuryProposalAction="approveProposal"
      />
    </Popup>
  );
}
