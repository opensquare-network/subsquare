import React from "react";
import dayjs from "dayjs";
import noop from "lodash.noop";
import isToday from "dayjs/plugin/isToday";
import styled, { css } from "styled-components";
import { p_12_bold } from "../../../../styles/componentCss";
import {
  cursor_pointer,
  flex,
  flex_col,
  h,
  justify_between,
  m,
  p,
  text_secondary,
  w_full,
} from "../../../../styles/tailwindcss";

dayjs.extend(isToday);

const CellLabel = styled.span`
  ${p_12_bold}
  ${m(0)}
  ${text_secondary}
  text-align: center;
  ${(p) =>
    !p.isSameMonth &&
    css`
      color: ${p => p.theme.textTertiary};
    `}
  ${(p) =>
    p.isPast &&
    css`
      color: ${p => p.theme.textPlaceholder};
    `}
`;

const CellWrapper = styled.div`
  ${w_full}
  ${h(32)}
  ${flex}
  ${flex_col}
  ${justify_between}
  ${p(8)}
  text-align: left;
  ${cursor_pointer}

  &:hover {
    background-color: ${p => p.theme.grey100Bg};
  }

  ${(p) =>
    p.isToday &&
    css`
      border: 1px solid ${p => p.theme.grey400Border};
      border-radius: 4px;
    `}

  ${(p) =>
    p.isSelectedDay &&
    css`
      background-color: ${p => p.theme.grey200Border};
    `}
`;

export default function CalendarMonthDateCell({
  label,
  date,
  selectedDate,
  setSelectedDate = noop,
}) {
  label = Number(label);

  const day = dayjs(date);
  const isToday = day.isToday();
  const isSelectedDay = day.isSame(selectedDate, "day");
  const isPast = day.isBefore(dayjs(), "day");
  const isSameMonth = day.isSame(selectedDate, "month");

  function onCellClick() {
    setSelectedDate(date);
  }

  return (
    <CellWrapper
      isToday={isToday}
      isSelectedDay={isSelectedDay}
      onClick={onCellClick}
    >
      <CellLabel isPast={isPast} isSameMonth={isSameMonth}>
        {label}
      </CellLabel>
    </CellWrapper>
  );
}
