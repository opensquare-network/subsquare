import Editor, { useEditorUploading } from "next-common/components/editor";
import ErrorText from "next-common/components/ErrorText";

export default function AppendantEditor({
  value = "",
  onChange,
  contentType = "markdown",
  onContentTypeChange,
  errors,
  disabled = false,
}) {
  const [editorUploading] = useEditorUploading();

  const handleContentChange = (newContent) => {
    onChange?.(newContent);
  };

  const handleContentTypeChange = (newContentType) => {
    onContentTypeChange?.(newContentType);
  };

  return (
    <>
      <Editor
        value={value}
        onChange={handleContentChange}
        contentType={contentType}
        setContentType={handleContentTypeChange}
        loadSuggestions={() => []}
        minHeight={100}
        setQuillRef={() => {}}
        disabled={disabled || editorUploading}
      />

      {errors?.data?.content?.[0] && (
        <ErrorText>{errors?.data?.content?.[0]}</ErrorText>
      )}
    </>
  );
}
