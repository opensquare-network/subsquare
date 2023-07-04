import React from "react";
import styled from "styled-components";
import { p_12_bold } from "../../../../styles/componentCss";
import { text_uppercase } from "../../../../styles/tailwindcss";

const Label = styled.div`
  ${p_12_bold}
  color: var(--textTertiary);
  ${text_uppercase}
  text-align: center;
`;

export default function CalendarMonthHeader({ label }) {
  const [first] = label;

  return <Label>{first}</Label>;
}
