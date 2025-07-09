import { useState, useMemo, useEffect } from "react";
import Editor, { useEditorUploading } from "next-common/components/editor";
import ErrorText from "next-common/components/ErrorText";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import Tooltip from "next-common/components/tooltip";
import { useDispatch } from "react-redux";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { appendantsApi } from "next-common/services/url";
import nextApi from "next-common/services/nextApi";

export default function AppendantEditor({
  onClose,
  editData = null,
  isEditMode = false,
  createApi = null,
  update,
}) {
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState("markdown");
  const [errors, setErrors] = useState();
  const [editorUploading] = useEditorUploading();
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { ensureLogin } = useEnsureLogin();

  useEffect(() => {
    if (isEditMode && editData) {
      setContent(editData.content || "");
      setContentType(editData.contentType || "markdown");
    }
  }, [isEditMode, editData]);

  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      if (!(await ensureLogin())) {
        return;
      }

      let result, error;

      if (isEditMode && editData) {
        const updateApi = appendantsApi(editData?._id);

        ({ result, error } = await nextApi.patch(updateApi, {
          content,
          contentType,
        }));
      } else {
        ({ result, error } = await nextApi.post(createApi, {
          content,
          contentType,
        }));
      }

      if (error) {
        if (error.data) {
          setErrors(error);
        } else {
          dispatch(newErrorToast(error.message));
        }
      }

      if (result) {
        const successMessage = `${
          isEditMode ? "Update" : "Append"
        } successfully`;

        dispatch(newSuccessToast(successMessage));
        onClose();
        update();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isEmpty = content === "" || content === "<p><br></p>";

  const isDisableSubmit = useMemo(() => {
    return isEmpty || editorUploading || submitting;
  }, [isEmpty, editorUploading, submitting]);

  const submitButtonText = isEditMode ? "Update" : "Submit";

  return (
    <>
      <Editor
        value={content}
        onChange={handleContentChange}
        contentType={contentType}
        setContentType={setContentType}
        loadSuggestions={() => []}
        minHeight={100}
        setQuillRef={() => {}}
        disabled={submitting}
      />

      {errors?.data?.content?.[0] && (
        <ErrorText>{errors?.data?.content?.[0]}</ErrorText>
      )}

      <div className="flex items-center justify-end mt-8 [&>:not(:first-child)]:ml-3">
        <SecondaryButton disabled={submitting} onClick={onClose}>
          Cancel
        </SecondaryButton>

        <Tooltip content={isEmpty ? "Cannot submit empty content" : ""}>
          <PrimaryButton
            loading={submitting}
            onClick={handleSubmit}
            disabled={isDisableSubmit}
          >
            {submitButtonText}
          </PrimaryButton>
        </Tooltip>
      </div>
    </>
  );
}
