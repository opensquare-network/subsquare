import PopupLabel from "../label";
import InputText from "next-common/components/inputText";

export default function TextInputField({ title = "Text", text, setText }) {
  return (
    <div>
      <PopupLabel text={title} />
      <InputText value={text} setValue={setText} />
    </div>
  );
}
