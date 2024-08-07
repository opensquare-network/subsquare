import Input from "next-common/components/input";
import PopupLabel from "../label";

export default function BlocksField({ title = "Blocks", value, setValue }) {
  return (
    <div>
      <PopupLabel text={title} />
      <Input
        value={value}
        placeholder="0"
        symbol="Block Height"
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
