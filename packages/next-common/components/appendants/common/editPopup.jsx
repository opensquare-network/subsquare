import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import { appendantsApi } from "next-common/services/url";
import nextApi from "next-common/services/nextApi";
import AppendantFormPopup from "./appendantFormPopup";
import { UpdateButton } from "./submitButton";

export default function EditAppendantPopup({
  onClose,
  editData,
  onSuccess,
  description = "You are editing an appendant.",
}) {
  const { ensureLogin } = useEnsureLogin();

  const submit = async (content, contentType) => {
    if (!(await ensureLogin())) {
      throw new Error("Cancelled");
    }

    const updateApi = appendantsApi(editData?._id);
    return await nextApi.patch(updateApi, {
      content,
      contentType,
    });
  };

  return (
    <AppendantFormPopup
      title="Edit Appendant"
      description={description}
      onClose={onClose}
      onSuccess={onSuccess}
      submit={submit}
      successMessage="Appendant updated successfully"
      initialContent={editData?.content || ""}
      initialContentType={editData?.contentType || "markdown"}
      SubmitButton={UpdateButton}
    />
  );
}
