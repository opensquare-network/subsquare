import { SystemQuestion } from "@osn/icons/subsquare";
import Tooltip from "../tooltip";

export function FieldTooltipTitle({ title, tooltip }) {
  return (
    <span className="flex items-center gap-x-1">
      <span>{title}</span>
      <Tooltip content={tooltip} className="!w-4 !h-4 !flex">
        <SystemQuestion className="inline-flex w-4 h-4 [&_path]:fill-textTertiary cursor-pointer" />
      </Tooltip>
    </span>
  );
}
