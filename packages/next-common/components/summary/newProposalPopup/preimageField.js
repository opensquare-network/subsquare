import Input from "next-common/components/input";
import PopupLabel from "next-common/components/popup/label";

export default function PreimageField() {
  return (
    <div>
      <PopupLabel text="Preimage" />
      <div className="flex flex-col gap-[8px]">
        <Input placeholder="Hash..." />
        <Input placeholder="Length..." />
      </div>
    </div>
  );
}
