import noop from "lodash.noop";
import PlusIcon from "./plus";
import SubtractIcon from "./subtract";

export default function FoldButton({ setFolded = noop, folded = false }) {
  return (
    <div
      className="inline-flex cursor-pointer"
      onClick={() => setFolded(!folded)}
    >
      {folded ? <PlusIcon /> : <SubtractIcon />}
    </div>
  );
}
