import PopupLabel from "../label";
import TextAreaInput from "next-common/components/textAreaInput";

export default function TextAreaField({
  title = "Text",
  placeholder = "",
  text,
  setText,
}) {
  return (
    <div>
      <PopupLabel text={title} />
      <TextAreaInput
        placeholder={placeholder}
        value={text}
        setValue={setText}
      />
    </div>
  );
}
