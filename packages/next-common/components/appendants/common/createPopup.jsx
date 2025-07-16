import { useState } from "react";
import { useDispatch } from "react-redux";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import nextApi from "next-common/services/nextApi";
import AppendantEditor from "./editor";
import AppendantPopupLayout from "./popupLayout";
import { CreateButton } from "./submitButton";

export default function CreateAppendantPopup({
  onClose,
  createApi,
  onSuccess,
  description = "",
}) {
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState("markdown");
  const [errors, setErrors] = useState();
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { ensureLogin } = useEnsureLogin();

  const handleSubmit = async () => {
    setSubmitting(true);
    setErrors(null);

    try {
      if (!(await ensureLogin())) {
        return;
      }

      const { result, error } = await nextApi.post(createApi, {
        content,
        contentType,
      });

      if (error) {
        if (error.data) {
          setErrors(error);
        } else {
          dispatch(newErrorToast(error.message));
        }
        return;
      }

      if (result) {
        dispatch(newSuccessToast("Appendant created successfully"));
        onSuccess?.();
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppendantPopupLayout
      title="Create Appendant"
      description={description}
      onClose={onClose}
      loading={submitting}
      actions={
        <CreateButton
          onClick={handleSubmit}
          loading={submitting}
          content={content}
        />
      }
    >
      <AppendantEditor
        value={content}
        onChange={setContent}
        contentType={contentType}
        onContentTypeChange={setContentType}
        errors={errors}
        disabled={submitting}
      />
    </AppendantPopupLayout>
  );
}
