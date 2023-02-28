import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import { DateHeaderProps } from "react-big-calendar";
import styled, { css } from "styled-components";
import { p_12_bold } from "../../../styles/componentCss";
import {
  bg_theme,
  border,
  border_theme_grey200,
  border_theme_grey400,
  cursor_default,
  cursor_pointer,
  flex,
  flex_col,
  h_full,
  m,
  p,
  rounded_4,
  text_placeholder,
  text_secondary,
  w_full,
} from "../../../styles/tailwindcss";
dayjs.extend(isToday);

const CellLabel = styled.p`
  ${p_12_bold}
  ${m(0)}
  ${text_secondary}
`;

const CellEventGroup = styled.div``;

const CellWrapper = styled.div`
  ${w_full}
  ${h_full}
  ${flex}
  ${flex_col}
  ${p(8)}
  ${border}
  ${border_theme_grey200}
  ${rounded_4}
  text-align: left;

  &:hover {
    ${cursor_pointer}
    ${border_theme_grey400}
  }

  ${(p) =>
    p.isOffRange &&
    css`
      ${bg_theme("grey100Bg")}

      ${CellLabel} {
        ${text_placeholder}
      }

      &:hover {
        ${cursor_default}
        ${border_theme_grey200}
      }
    `}

  ${(p) => p.isToday && border_theme_grey400}
`;

/**
 * @param {DateHeaderProps} props
 */
export default function FullCalendarMonthDateCell(props) {
  const { label, isOffRange, date } = props ?? {};
  const isToday = dayjs(date).isToday();

  return (
    <CellWrapper isOffRange={isOffRange} isToday={isToday}>
      <CellLabel>{label}</CellLabel>

      <CellEventGroup></CellEventGroup>
    </CellWrapper>
  );
}
