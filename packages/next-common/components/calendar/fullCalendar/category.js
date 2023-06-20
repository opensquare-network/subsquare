import React from "react";
import styled from "styled-components";
import { p_12_medium } from "../../../styles/componentCss";
import {
  inline_flex,
  items_center,
  m_l,
  rounded_full,
} from "../../../styles/tailwindcss";
import { FULLCALENDAR_CATEGORY_COLORS } from "./consts";

const Wrapper = styled.span`
  ${inline_flex}
  ${items_center}
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  ${rounded_full}
  background-color: ${(p) => p.color || "var(--textTertiary)"};
`;

const Label = styled.span`
  ${p_12_medium}
  color: var(--textSecondary);
  ${m_l(8)}
`;

export default function FullCalendarCategory({
  category,
  onlyDot = false,
  color,
}) {
  const categoryColor = color ?? FULLCALENDAR_CATEGORY_COLORS[category];

  return (
    <Wrapper>
      <Dot color={categoryColor} />
      {!onlyDot && category && <Label>{category}</Label>}
    </Wrapper>
  );
}
