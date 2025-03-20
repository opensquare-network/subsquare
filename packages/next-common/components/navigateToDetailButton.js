import { ArrowRight } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";

export default function NavigateToDetailButton({ disabled, onClick }) {
  return (
    <div
      role="button"
      className={cn(
        "cursor-pointer p-[6px]",
        "rounded-[4px] border border-neutral400 hover:border-neutral500",
        disabled
          ? "pointer-events-none [&_svg_path]stroke-textDisabled"
          : "[&_svg_path]stroke-textPrimary",
      )}
      disabled={disabled}
      onClick={onClick}
    >
      <ArrowRight width={16} height={16} />
    </div>
  );
}
