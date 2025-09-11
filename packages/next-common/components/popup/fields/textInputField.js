import PopupLabel from "../label";
import InputText from "next-common/components/inputText";

export default function TextInputField({
  title = "Text",
  text,
  setText,
  className,
  disabled = false,
  placeholder = "",
}) {
  return (
    <div className={className}>
      <PopupLabel text={title} />
      <InputText
        value={text}
        setValue={setText}
        disabled={disabled}
        placeholder={placeholder}
      />
    </div>
  );
}
