import Popup from "next-common/components/popup/wrapper/Popup";
import TreasuryProposalPopupContent from "./common/treasuryProposalPopupContent";

export default function ApproveTreasuryProposalInnerPopup({
  onClose,
  isMember,
}) {
  return (
    <Popup
      title="Approve Treasury Proposal"
      maskClosable={false}
      onClose={onClose}
    >
      <TreasuryProposalPopupContent
        onClose={onClose}
        isMember={isMember}
        treasuryProposalAction="approveProposal"
      />
    </Popup>
  );
}
