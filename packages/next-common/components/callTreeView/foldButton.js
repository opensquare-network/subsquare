import noop from "lodash.noop";
import PlusIcon from "next-common/components/icons/plus";
import SubtractIcon from "next-common/components/icons/subtract";

export default function FoldButton({ setFolded = noop, folded = false }) {
  return (
    <div className="cursor-pointer" onClick={() => setFolded(!folded)}>
      {folded ? <PlusIcon /> : <SubtractIcon />}
    </div>
  );
}
