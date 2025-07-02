import { useState, useMemo } from "react";
import Editor, { useEditorUploading } from "next-common/components/editor";
import { useUser } from "next-common/context/user";
import ErrorText from "next-common/components/ErrorText";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
// import { useDispatch } from "react-redux";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
// import { newErrorToast } from "next-common/store/reducers/toastSlice";

export default function AppendantEditor({ value = "", onChange }) {
  const [isShow, setIsShow] = useState(true);
  const user = useUser();
  const [content, setContent] = useState(value);
  const [contentType, setContentType] = useState(
    user?.preference?.editor || "markdown",
  );
  const [errors, setErrors] = useState();
  const [editorUploading] = useEditorUploading();
  const [submitting, setSubmitting] = useState(false);
  // const dispatch = useDispatch();
  const { ensureLogin } = useEnsureLogin();

  const handleContentChange = (newContent) => {
    setContent(newContent);
    if (onChange) {
      onChange(newContent);
    }
  };

  // TODO
  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      if (!(await ensureLogin())) {
        return;
      }

      // const { result, error } = await nextApi.post()
      // if (error) {
      //   if (error.data) {
      //     setErrors(error);
      //   } else {
      //     dispatch(newErrorToast(error.message));
      //   }
      // }
    } finally {
      setSubmitting(false);
    }
  };

  const isEmpty = content === "" || content === "<p><br></p>";

  const isDisableSubmit = useMemo(() => {
    return isEmpty || editorUploading || submitting;
  }, [isEmpty, editorUploading, submitting]);

  if (!isShow) {
    return null;
  }

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
        <SecondaryButton loading={submitting} onClick={() => setIsShow(false)}>
          Cancel
        </SecondaryButton>
        <PrimaryButton
          loading={submitting}
          onClick={handleSubmit}
          disabled={isDisableSubmit}
        >
          Submit
        </PrimaryButton>
      </div>
    </>
  );
}
