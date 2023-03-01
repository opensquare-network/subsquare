import styled from "styled-components";
import { p_12_medium } from "../../../styles/componentCss";
import {
  bg_theme,
  inline_flex,
  items_center,
  m_l,
  rounded_full,
  text_secondary,
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
  ${(p) => bg_theme(p.color)}
`;

const Label = styled.span`
  ${p_12_medium}
  ${text_secondary}
  ${m_l(8)}
`;

export default function FullCalendarCategory({ category, onlyDot = false }) {
  const color = FULLCALENDAR_CATEGORY_COLORS[category];

  return (
    <Wrapper>
      <Dot color={color} />
      {!onlyDot && <Label>{category}</Label>}
    </Wrapper>
  );
}
