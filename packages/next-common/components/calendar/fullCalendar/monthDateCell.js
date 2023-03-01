import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import groupBy from "lodash.groupby";
import { DateHeaderProps } from "react-big-calendar";
import styled, { css } from "styled-components";
import { p_12_bold } from "../../../styles/componentCss";
import {
  bg_theme,
  border,
  border_color_theme,
  border_theme_grey200,
  border_theme_grey400,
  cursor_default,
  cursor_pointer,
  flex,
  flex_col,
  gap_x,
  h_full,
  justify_between,
  m,
  p,
  rounded_4,
  text_placeholder,
  text_secondary,
  text_theme,
  w_full,
} from "../../../styles/tailwindcss";
import FullCalendarCategory from "./category";
import { FULLCALENDAR_CATEGORIES } from "./consts";
dayjs.extend(isToday);

const CellLabel = styled.p`
  ${p_12_bold}
  ${m(0)}
  ${text_secondary}
`;

const CellEventGroup = styled.div`
  ${flex}
  ${gap_x(4)}
`;

const CellWrapper = styled.div`
  ${w_full}
  ${h_full}
  ${flex}
  ${flex_col}
  ${justify_between}
  ${p(8)}
  ${border}
  ${border_theme_grey200}
  ${rounded_4}
  text-align: left;
  ${cursor_pointer}

  &:hover {
    ${border_theme_grey400}
  }

  ${(p) => p.isToday && border_theme_grey400}

  ${(p) =>
    p.isSelectedDay &&
    css`
      ${border_color_theme("primaryPurple500")}

      ${CellLabel} {
        ${text_theme("primaryPurple500")}
      }

      &:hover {
        ${border_color_theme("primaryPurple500")}
      }
    `}

  ${(p) =>
    p.isOffRange &&
    css`
      pointer-events: none;
      ${bg_theme("grey100Bg")}
      ${border_theme_grey200}
      ${cursor_default}

      ${CellLabel} {
        ${text_placeholder}
      }
    `}
`;

/**
 * @param {DateHeaderProps} props
 */
export default function FullCalendarMonthDateCell({
  label,
  isOffRange,
  date,
  selectedDate,
  setSelectedDate,
  calendarEvents = [],
}) {
  const day = dayjs(date);
  const isToday = day.isToday();
  const isSelectedDay = day.isSame(selectedDate, "day");

  const dayEvents = calendarEvents.filter((event) => {
    const blockTime = event.indexer.blockTime;
    return day.isSame(blockTime, "day");
  });

  const events = groupBy(dayEvents, "category");
  const categories = FULLCALENDAR_CATEGORIES.filter((category) =>
    Object.keys(events).includes(category)
  );

  function onCellClick() {
    if (isOffRange) {
      return;
    }

    setSelectedDate(date);
  }

  return (
    <CellWrapper
      isOffRange={isOffRange}
      isToday={isToday}
      isSelectedDay={isSelectedDay}
      onClick={onCellClick}
    >
      <CellLabel>{label}</CellLabel>

      <CellEventGroup>
        {categories.map((category) => (
          <FullCalendarCategory category={category} onlyDot />
        ))}
      </CellEventGroup>
    </CellWrapper>
  );
}
