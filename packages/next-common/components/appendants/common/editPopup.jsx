import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { appendantsApi } from "next-common/services/url";
import nextApi from "next-common/services/nextApi";
import AppendantEditor from "./editor";
import AppendantPopupLayout from "./popupLayout";
import { UpdateButton } from "./submitButton";

export default function EditAppendantPopup({
  onClose,
  editData,
  onSuccess,
  description = "You are editing an appendant.",
}) {
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState("markdown");
  const [errors, setErrors] = useState();
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { ensureLogin } = useEnsureLogin();

  useEffect(() => {
    if (editData) {
      setContent(editData.content || "");
      setContentType(editData.contentType || "markdown");
    }
  }, [editData]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setErrors(null);

    try {
      if (!(await ensureLogin())) {
        return;
      }

      const updateApi = appendantsApi(editData?._id);
      const { result, error } = await nextApi.patch(updateApi, {
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
        dispatch(newSuccessToast("Appendant updated successfully"));
        onSuccess?.();
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppendantPopupLayout
      title="Edit Appendant"
      description={description}
      onClose={onClose}
      loading={submitting}
      actions={
        <UpdateButton
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
