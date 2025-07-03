import { useState, useMemo } from "react";
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
import { treasuryBountiesAppendantApi } from "next-common/services/url";
import nextApi from "next-common/services/nextApi";
import { useOnchainData } from "next-common/context/post";
import { useRouter } from "next/router";

export default function AppendantEditor({ value = "", onChange, onClose }) {
  const { bountyIndex } = useOnchainData();
  const [content, setContent] = useState(value);
  const [contentType, setContentType] = useState("markdown");
  const [errors, setErrors] = useState();
  const [editorUploading] = useEditorUploading();
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { ensureLogin } = useEnsureLogin();
  const router = useRouter();

  const handleContentChange = (newContent) => {
    setContent(newContent);
    if (onChange) {
      onChange(newContent);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const api = treasuryBountiesAppendantApi(bountyIndex);

    try {
      if (!(await ensureLogin())) {
        return;
      }

      const { result, error } = await nextApi.post(api, {
        content,
        contentType,
      });

      if (error) {
        if (error.data) {
          setErrors(error);
        } else {
          dispatch(newErrorToast(error.message));
        }
      }

      if (result) {
        dispatch(newSuccessToast("Append successfully"));
        onClose();
        router.replace(router.asPath);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isEmpty = content === "" || content === "<p><br></p>";

  const isDisableSubmit = useMemo(() => {
    return isEmpty || editorUploading || submitting;
  }, [isEmpty, editorUploading, submitting]);

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
            Submit
          </PrimaryButton>
        </Tooltip>
      </div>
    </>
  );
}
