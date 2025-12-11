import tw from "tailwind-styled-components";
import { noop } from "lodash-es";
import { formatNum } from "next-common/utils";
import { PROJECT_CHART_TYPES } from "./projectChart";
import { FIXED_LABEL_WIDTH } from "../const";

const LabelContainer = tw.div`
  absolute -translate-y-1/2
  cursor-pointer pointer-events-auto 
  text-textPrimary text12Medium 
  flex items-center gap-1 
  hover:underline
`;

const Label = tw.span`
  truncate
`;

const Value = tw.span`
  flex-shrink-0
`;

export default function BarLabels({
  labels,
  type = PROJECT_CHART_TYPES.BAR,
  onClick = noop,
}) {
  if (type !== PROJECT_CHART_TYPES.BAR) {
    return null;
  }

  return labels.map((position) => (
    <LabelContainer
      title={`${position.label} ${formatNum(position.value)}`}
      style={{
        left: 0,
        top: `${position.y}px`,
        maxWidth: FIXED_LABEL_WIDTH,
      }}
      key={position.index}
      onClick={() => onClick(position)}
      role="button"
    >
      <Label>{position.label}</Label>
      <Value>{formatNum(position.value)}</Value>
    </LabelContainer>
  ));
}
