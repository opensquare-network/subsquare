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
  w_full,
} from "../../../../styles/tailwindcss";

dayjs.extend(isToday);

const CellLabel = styled.span`
  ${p_12_bold}
  ${m(0)}
  color: var(--textSecondary);
  text-align: center;
  ${(p) =>
    !p.isSameMonth &&
    css`
      color: var(--textTertiary);
    `}
  ${(p) =>
    p.isPast &&
    css`
      color: var(--textDisabled);
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
    background-color: var(--neutral200);
  }

  ${(p) =>
    p.isToday &&
    css`
      border: 1px solid var(--neutral500);
      border-radius: 4px;
    `}

  ${(p) =>
    p.isSelectedDay &&
    css`
      background-color: var(--neutral300);
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
