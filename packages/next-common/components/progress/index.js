import { cn } from "next-common/utils";
import tw from "tailwind-styled-components";

const Bar = tw.div`absolute inset-0 overflow-hidden`;

export default function Progress({
  percentage = 0,
  fg = "var(--blue500)",
  bg = "var(--blue100)",
  rounded = true,
}) {
  return (
    <div className={cn("relative overflow-hidden h-2", rounded && "rounded")}>
      <Bar className="bg-neutral200" />
      <Bar style={{ backgroundColor: bg }}>
        <Bar style={{ backgroundColor: fg, width: `${percentage}%` }} />
      </Bar>
    </div>
  );
}
