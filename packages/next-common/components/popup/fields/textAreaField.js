import PopupLabel from "../label";
import TextAreaInput from "next-common/components/textAreaInput";

export default function TextAreaField({ title = "Text", text, setText }) {
  return (
    <div>
      <PopupLabel text={title} />
      <TextAreaInput value={text} setValue={setText} />
    </div>
  );
}
