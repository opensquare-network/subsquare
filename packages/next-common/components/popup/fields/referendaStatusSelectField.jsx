import noop from "lodash.noop";
import Select from "next-common/components/select";
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
    gov2State.Deciding,
    gov2State.Confirming,
    gov2State.Preparing,
    gov2State.Queueing,
    gov2State.Approved,
    gov2State.Executed,
    gov2State.Rejected,
    gov2State.TimedOut,
    gov2State.Cancelled,
    gov2State.Killed,
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
  return (
    <StyledSelect options={options} value={value} onChange={onChange} small />
  );
}

function Label({ label }) {
  const colors = {
    [gov2State.Preparing]: "var(--azure500)",
    [gov2State.Queueing]: "var(--orange500)",
    [gov2State.Deciding]: "var(--blue500)",
    [gov2State.Confirming]: "var(--green500)",
    [gov2State.Executed]: "var(--green500)",
    [gov2State.Approved]: "var(--green500)",
    [gov2State.Rejected]: "var(--red500)",
    [gov2State.Killed]: "var(--red500)",
    [gov2State.Cancelled]: "var(--red500)",
    [gov2State.TimedOut]: "var(--neutral500)",
  };

  return (
    <LabelWrapper>
      {colors[label] && <LabelColorRectangle color={colors[label]} />}
      <span>{label}</span>
    </LabelWrapper>
  );
}
