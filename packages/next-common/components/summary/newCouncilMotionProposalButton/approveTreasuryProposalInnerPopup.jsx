import Popup from "next-common/components/popup/wrapper/Popup";
import TreasuryProposalPopupContent from "./common/treasuryProposalPopupContent";
import { usePopupParams } from "next-common/components/popupWithSigner/context";

export default function ApproveTreasuryProposalInnerPopup({ isMember }) {
  const { onClose } = usePopupParams();
  return (
    <Popup
      className="!w-[640px]"
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
