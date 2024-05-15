import { cn } from "next-common/utils";
import { ArrowRight } from "@osn/icons/subsquare";

export default function QuickStartButton({ title, onClick }) {
  return (
    <div
      className={cn(
        "flex items-center pl-[16px] py-[10px] pr-[10px] gap-[8px]",
        "cursor-pointer rounded-full border border-neutral400 hover:border-neutral500",
      )}
      onClick={onClick}
    >
      <span className="text-textPrimary text14Medium">{title}</span>
      <div className="inline-flex">
        <ArrowRight
          className="[&_path]:stroke-textTertiary"
          width={20}
          height={20}
        />
      </div>
    </div>
  );
}
