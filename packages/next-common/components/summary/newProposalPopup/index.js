import Popup from "next-common/components/popup/wrapper/Popup";

export default function NewProposalPopup({ onClose }) {
  return <Popup wide title="New Proposal" onClose={onClose}></Popup>;
}
