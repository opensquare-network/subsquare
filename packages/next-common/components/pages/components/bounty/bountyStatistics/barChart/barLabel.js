import tw from "tailwind-styled-components";
import { noop } from "lodash-es";
import { formatNum } from "next-common/utils";

const LabelContainer = tw.div`
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

export default function BarLabel({ label, onClick = noop }) {
  return (
    <LabelContainer
      title={`${label.label} ${formatNum(label.value)}`}
      key={label.index}
      onClick={() => onClick(label)}
      role="button"
    >
      <Label>{label.nameAbbr ?? label.label}</Label>
      <Value>{formatNum(label.value)}</Value>
    </LabelContainer>
  );
}
