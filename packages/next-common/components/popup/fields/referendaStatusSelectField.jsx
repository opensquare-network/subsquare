import noop from "lodash.noop";
import Select from "next-common/components/select";
import { useThemeSetting } from "next-common/context/theme";
import { p_12_medium } from "next-common/styles/componentCss";
import {
  flex,
  gap_x,
  items_center,
  rounded,
} from "next-common/styles/tailwindcss";
import { gov2State } from "next-common/utils/consts/state";
import styled from "styled-components";

const StyledSelect = styled(Select)`
  width: 160px;
  height: 32px;
`;

const LabelWrapper = styled.div`
  ${flex};
  ${gap_x(8)};
  ${items_center};
  ${p_12_medium};
`;

const LabelColorRectangle = styled.span`
  width: 6px;
  height: 6px;
  background-color: ${(p) => p.color};
  ${rounded};
`;

const options = [
  {
    value: "",
    label: <Label label="All status" />,
  },
  ...[
    gov2State.Preparing,
    gov2State.Queueing,
    gov2State.Deciding,
    gov2State.Confirming,
    gov2State.Executed,
    gov2State.Rejected,
    gov2State.Killed,
    gov2State.Cancelled,
    gov2State.TimedOut,
  ].map((label) => {
    return {
      label: <Label label={label} />,
      value: label,
    };
  }),
];

export default function ReferendaStatusSelectField({
  value = "",
  onChange = noop,
}) {
  return <StyledSelect options={options} value={value} onChange={onChange} />;
}

function Label({ label }) {
  const theme = useThemeSetting();

  const colors = {
    [gov2State.Preparing]: theme.secondaryAzure500,
    [gov2State.Queueing]: theme.secondaryYellow500,
    [gov2State.Deciding]: theme.secondaryBlue500,
    [gov2State.Confirming]: theme.secondaryGreen500,
    [gov2State.Executed]: theme.secondaryGreen500,
    [gov2State.Rejected]: theme.secondaryRed500,
    [gov2State.Killed]: theme.secondaryRed500,
    [gov2State.Cancelled]: theme.secondaryRed500,
    [gov2State.TimedOut]: theme.grey400Border,
  };

  return (
    <LabelWrapper>
      {colors[label] && <LabelColorRectangle color={colors[label]} />}
      <span>{label}</span>
    </LabelWrapper>
  );
}
