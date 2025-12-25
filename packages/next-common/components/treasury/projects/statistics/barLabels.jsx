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

  return labels.map((label) => (
    <LabelContainer
      title={`${label.label} ${formatNum(label.value)}`}
      style={{
        left: 0,
        top: `${label.y}px`,
        maxWidth: FIXED_LABEL_WIDTH,
      }}
      key={label.index}
      onClick={() => onClick(label)}
      role="button"
    >
      <Label>{label.nameAbbr ?? label.label}</Label>
      <Value>{formatNum(label.value)}</Value>
    </LabelContainer>
  ));
}
