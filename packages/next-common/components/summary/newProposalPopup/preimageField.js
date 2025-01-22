import Input from "next-common/lib/input";
import PopupLabel from "next-common/components/popup/label";

export default function PreimageField({
  preimageHash,
  setPreimageHash,
  preimageLength,
  setPreimageLength,
}) {
  return (
    <div>
      <PopupLabel text="Preimage" />
      <div className="flex flex-col gap-[8px]">
        <Input
          placeholder="Hash..."
          value={preimageHash}
          onChange={(e) => setPreimageHash(e.target.value)}
        />
        <Input
          placeholder="Length..."
          value={preimageLength}
          onChange={(e) => setPreimageLength(e.target.value)}
        />
      </div>
    </div>
  );
}
