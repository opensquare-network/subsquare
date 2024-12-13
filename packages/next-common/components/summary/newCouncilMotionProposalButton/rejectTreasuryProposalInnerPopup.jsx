import Popup from "next-common/components/popup/wrapper/Popup";
import TreasuryProposalPopupContent from "./common/treasuryProposalPopupContent";

export default function RejectTreasuryProposalInnerPopup({
  onClose,
  isMember,
}) {
  return (
    <Popup
      title="Reject Treasury Proposal"
      maskClosable={false}
      onClose={onClose}
    >
      <TreasuryProposalPopupContent
        onClose={onClose}
        isMember={isMember}
        treasuryProposalAction="rejectProposal"
      />
    </Popup>
  );
}
