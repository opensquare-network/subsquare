import RemoveSVG from "./remove.svg";
import noop from "lodash.noop";
import { cn } from "next-common/utils";

export default function SelectedValueItem({ title, onRemove = noop }) {
  return (
    <div
      className={cn(
        "flex justify-center items-center gap-1",
        "text12Medium text-textPrimary",
        "py-0.5 px-1",
        "rounded bg-gray100",
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <span>{title}</span>
      <div className="cursor-pointer" onClick={onRemove}>
        <RemoveSVG />
      </div>
    </div>
  );
}
