import React from "react";
import styled from "styled-components";
import { p_12_bold } from "../../../../styles/componentCss";
import { text_tertiary, text_uppercase } from "../../../../styles/tailwindcss";

const Label = styled.div`
  ${p_12_bold}
  ${text_tertiary}
  ${text_uppercase}
  text-align: center;
`;

export default function CalendarMonthHeader({ label }) {
  const [first] = label;

  return <Label>{first}</Label>;
}
