import AppendantPopup from "next-common/components/appendants/common/appendantPopup";
import AppendantEditor from "next-common/components/appendants/common/appendantEditor";
import { gov2ReferendaAppendantApi } from "next-common/services/url";
import { useReferendaAppendantsContext } from "next-common/context/referendaAppendants";
import { usePageProps } from "next-common/context/page";

export default function ReferendaAppendantPopup({
  setIsAppend,
  editData = null,
  isEditMode = false,
}) {
  const { update } = useReferendaAppendantsContext();
  const { id } = usePageProps();
  const createApi = gov2ReferendaAppendantApi(id);

  const description = `You are ${
    isEditMode ? "editing" : "adding"
  } an appendant as authors.`;

  return (
    <AppendantPopup
      description={description}
      isEditMode={isEditMode}
      editData={editData}
      setIsAppend={setIsAppend}
    >
      <AppendantEditor
        onClose={() => {
          setIsAppend(false);
        }}
        editData={editData}
        isEditMode={isEditMode}
        createApi={createApi}
        update={update}
      />
    </AppendantPopup>
  );
}
