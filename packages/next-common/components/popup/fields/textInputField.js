import PopupLabel from "../label";
import InputText from "next-common/components/inputText";

export default function TextInputField({
  title = "Text",
  text,
  setText,
  className,
  disabled = false,
}) {
  return (
    <div className={className}>
      <PopupLabel text={title} />
      <InputText
        value={text}
        setValue={setText}
        disabled={disabled}
      />
    </div>
  );
}
