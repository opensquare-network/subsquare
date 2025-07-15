import { useReferendaAppendantsContext } from "next-common/context/referendaAppendants";
import EditAppendantPopup from "../common/editPopup";

export default function ReferendaEditAppendantPopup({ onClose, editData }) {
  const { update } = useReferendaAppendantsContext();

  return (
    <EditAppendantPopup
      onClose={onClose}
      editData={editData}
      onSuccess={update}
      description="You are editing an appendant as authors."
      title="Edit Appendant"
    />
  );
}
