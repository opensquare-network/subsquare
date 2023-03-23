import React from "react";
import styled from "styled-components";
import { p_12_bold } from "../../../styles/componentCss";
import {
  hidden,
  text_tertiary,
  text_uppercase,
} from "../../../styles/tailwindcss";
import { smcss } from "../../../utils/responsive";

const Label = styled.div`
  ${p_12_bold}
  ${text_tertiary}
  ${text_uppercase}
  text-align: left;
`;
const Rest = styled.span`
  ${smcss(hidden)}
`;

/**
 * @param {import("react-big-calendar").HeaderProps}
 */
export default function FullCalendarMonthHeader({ label }) {
  const [first, ...rest] = label;

  return (
    <Label>
      {first}
      <Rest>{rest.join("")}</Rest>
    </Label>
  );
}
