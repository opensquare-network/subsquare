import tw from "tailwind-styled-components";
import { cn, formatNum } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";

const LabelContainer = tw.div`
  text-textPrimary text12Medium
  flex items-center gap-2 justify-between
`;

export default function BarLabel({ label, onClick, TooltipContent }) {
  return (
    <Tooltip content={TooltipContent && <TooltipContent data={label.data} />}>
      <LabelContainer
        key={label.index}
        {...(onClick && {
          onClick: () => onClick(label),
          role: "button",
        })}
        {...(!TooltipContent && {
          title: `${label.name || label.label} ${formatNum(label.value)}`,
        })}
      >
        <div
          className={cn(
            "truncate",
            onClick ? "hover:underline cursor-pointer" : "pointer-events-auto",
          )}
        >
          {label.nameAbbr ?? label.label}
        </div>
        <span className="flex-shrink-0">{formatNum(label.value)}</span>
      </LabelContainer>
    </Tooltip>
  );
}
