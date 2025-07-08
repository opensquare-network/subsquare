import AppendantEditorPopup from "next-common/components/appendants/common/editorPopup";
import AppendantEditor from "next-common/components/appendants/common/editor";
import { treasuryBountiesAppendantApi } from "next-common/services/url";
import { useBountyAppendantsContext } from "next-common/context/bountyAppendants";
import { usePageProps } from "next-common/context/page";

export default function BountyEditorAppendantPopup({
  setIsAppend,
  editData = null,
  isEditMode = false,
}) {
  const { update } = useBountyAppendantsContext();
  const { id } = usePageProps();
  const createApi = treasuryBountiesAppendantApi(id);

  const description = `You are ${
    isEditMode ? "editing" : "adding"
  } an appendant as proposer/curator.`;

  return (
    <AppendantEditorPopup
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
    </AppendantEditorPopup>
  );
}
