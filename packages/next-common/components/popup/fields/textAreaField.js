import TextArea from "next-common/components/textArea";
import PopupLabel from "../label";

export default function TextAreaField({ title = "Text", text, setText }) {
  return (
    <div>
      <PopupLabel text={title} />
      <TextArea value={text} setValue={setText} />
    </div>
  );
}
