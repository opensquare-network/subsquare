import tw from "tailwind-styled-components";
import { noop } from "lodash-es";
import { formatNum } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";

const LabelContainer = tw.div`
  cursor-pointer pointer-events-auto
  text-textPrimary text12Medium
  flex items-center gap-2 justify-between
  hover:underline
`;

const Label = tw.span`
  truncate
`;

const Value = tw.span`
  flex-shrink-0
`;

export default function BarLabel({ label, onClick = noop, TooltipContent }) {
  return (
    <Tooltip content={TooltipContent && <TooltipContent data={label.data} />}>
      <LabelContainer
        key={label.index}
        onClick={() => onClick(label)}
        role="button"
        {...(!TooltipContent && {
          title: `${label.name || label.label} ${formatNum(label.value)}`,
        })}
      >
        <Label>{label.nameAbbr ?? label.label}</Label>
        <Value>{formatNum(label.value)}</Value>
      </LabelContainer>
    </Tooltip>
  );
}
