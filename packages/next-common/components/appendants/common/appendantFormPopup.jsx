import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AppendantEditor from "./editor";
import AppendantPopupLayout from "./popupLayout";
import { CreateButton } from "./submitButton";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";

export default function AppendantFormPopup({
  title,
  description = "",
  onClose,
  onSuccess,
  submit,
  successMessage,
  initialContent = "",
  initialContentType = "markdown",
  SubmitButton = CreateButton,
}) {
  const [content, setContent] = useState(initialContent || "");
  const [contentType, setContentType] = useState(
    initialContentType || "markdown",
  );
  const [errors, setErrors] = useState();
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setContent(initialContent || "");
    setContentType(initialContentType || "markdown");
  }, [initialContent, initialContentType]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setErrors(null);

    try {
      const { result, error } = await submit(content, contentType);
      if (error) {
        if (error.data) {
          setErrors(error);
        } else {
          dispatch(newErrorToast(error.message));
        }
        return;
      }

      if (result) {
        dispatch(newSuccessToast(successMessage));
        onSuccess?.();
        onClose();
      }
    } catch (e) {
      if (e.message !== "Cancelled") {
        dispatch(newErrorToast(e.message));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppendantPopupLayout
      title={title}
      description={description}
      onClose={onClose}
      loading={submitting}
      actions={
        <SubmitButton
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
