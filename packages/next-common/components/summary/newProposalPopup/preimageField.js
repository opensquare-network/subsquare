import Input from "next-common/components/input";
import PopupLabel from "next-common/components/popup/label";

export default function PreimageField({ setPreimageHash, setPreimageLength }) {
  return (
    <div>
      <PopupLabel text="Preimage" />
      <div className="flex flex-col gap-[8px]">
        <Input
          placeholder="Hash..."
          onChange={(e) => setPreimageHash(e.target.value)}
        />
        <Input
          placeholder="Length..."
          onChange={(e) => setPreimageLength(e.target.value)}
        />
      </div>
    </div>
  );
}
