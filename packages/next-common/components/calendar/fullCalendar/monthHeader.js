import React from "react";
import styled from "styled-components";
import { p_12_bold } from "../../../styles/componentCss";
import { text_tertiary, text_uppercase } from "../../../styles/tailwindcss";
import { useIsScreenSize } from "../../../utils/hooks/useIsScreenSize";

const Label = styled.div`
  ${p_12_bold}
  ${text_tertiary}
  ${text_uppercase}
  text-align: left;
`;

/**
 * @param {import("react-big-calendar").HeaderProps}
 */
export default function FullCalendarMonthHeader({ label }) {
  const { isSmSize } = useIsScreenSize();

  if (isSmSize) {
    label = label.slice(0, 1);
  }

  return <Label>{label}</Label>;
}
