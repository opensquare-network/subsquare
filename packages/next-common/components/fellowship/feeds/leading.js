import Bar from "next-common/components/fellowship/feeds/bar";
import { cn } from "next-common/utils";

export default function FellowshipFeedLeadingBar({ isLast }) {
  return (
    <div className="flex flex-col">
      <Bar className="h-2.5 grow-0" />

      <div className="w-3 h-5 flex items-center">
        <div className="w-3 h-3 border-[3px] border-theme500 rounded-full" />
      </div>

      <Bar className={cn(isLast && "bg-transparent")} />
    </div>
  );
}
