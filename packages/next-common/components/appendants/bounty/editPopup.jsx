import { useBountyAppendantsContext } from "next-common/context/bountyAppendants";
import EditAppendantPopup from "../common/editPopup";

export default function BountyEditAppendantPopup({ onClose, editData }) {
  const { update } = useBountyAppendantsContext();

  return (
    <EditAppendantPopup
      onClose={onClose}
      editData={editData}
      onSuccess={update}
      description="You are editing an appendant as proposer/curator."
      title="Edit Appendant"
    />
  );
}