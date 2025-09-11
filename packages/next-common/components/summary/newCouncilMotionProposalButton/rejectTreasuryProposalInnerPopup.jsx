import Popup from "next-common/components/popup/wrapper/Popup";
import TreasuryProposalPopupContent from "./common/treasuryProposalPopupContent";
import { usePopupParams } from "next-common/components/popupWithSigner/context";

export default function RejectTreasuryProposalInnerPopup({ isMember }) {
  const { onClose } = usePopupParams();
  return (
    <Popup title="Reject Treasury Proposal" onClose={onClose}>
      <TreasuryProposalPopupContent
        onClose={onClose}
        isMember={isMember}
        treasuryProposalAction="rejectProposal"
      />
    </Popup>
  );
}
