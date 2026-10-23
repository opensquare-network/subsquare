import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import nextApi from "next-common/services/nextApi";
import AppendantFormPopup from "./appendantFormPopup";

export default function CreateAppendantPopup({
  onClose,
  createApi,
  onSuccess,
  description = "",
}) {
  const { ensureLogin } = useEnsureLogin();

  const submit = async (content, contentType) => {
    if (!(await ensureLogin())) {
      throw new Error("Cancelled");
    }

    return await nextApi.post(createApi, {
      content,
      contentType,
    });
  };

  return (
    <AppendantFormPopup
      title="Create Appendant"
      description={description}
      onClose={onClose}
      onSuccess={onSuccess}
      submit={submit}
      successMessage="Appendant created successfully"
    />
  );
}
