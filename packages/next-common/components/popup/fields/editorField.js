import Editor from "next-common/components/editor";
import PopupLabel from "../label";

export default function EditorField({
  title = "Content",
  content,
  setContent,
  minHeight = 100,
}) {
  return (
    <div>
      <PopupLabel text={title} />
      <Editor
        value={content}
        onChange={setContent}
        contentType={"markdown"}
        minHeight={minHeight}
      />
    </div>
  );
}
