import Input from "next-common/components/input";
import PopupLabel from "next-common/components/popup/label";

export default function EnactmentBlocks() {
  return (
    <div>
      <PopupLabel text="Enactment Blocks" />
      <div className="flex flex-col gap-[8px]">
        <Input placeholder="0" suffix="Blocks" />
      </div>
    </div>
  );
}
