import React from "react";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import groupBy from "lodash.groupby";
import styled, { css } from "styled-components";
import { p_12_bold, p_12_normal } from "../../../styles/componentCss";
import {
  block,
  border,
  border_color_theme,
  border_theme_grey200,
  border_theme_grey400,
  cursor_pointer,
  flex,
  flex_col,
  gap_x,
  h_full,
  justify_between,
  m,
  m_r,
  p,
  p_l,
  rounded_4,
  text_secondary,
  text_theme,
  w_full,
} from "../../../styles/tailwindcss";
import TooltipOrigin from "../../tooltip";
import FullCalendarCategory from "./category";
import { FULLCALENDAR_CATEGORIES } from "./consts";
import { useIsScreenSize } from "../../../utils/hooks/useIsScreenSize";
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
`;

const TooltipSubcategoryWrapper = styled.ul`
  ${m(0)}
  ${p(0)}
  list-style: none;

  li {
    ${p_l(4)}
    &::before {
      content: "•";
      ${m_r(4)}
    }
  }
`;
const TooltipContentWrapper = styled.div`
  ${p_12_normal}
  text-align: left;
`;
const TooltipChildrenWrapper = styled.div`
  ${h_full}
`;
const Tooltip = styled(TooltipOrigin)`
  ${block}
  ${h_full}
`;

/**
 * @param {import("react-big-calendar").DateHeaderProps}
 */
export default function FullCalendarMonthDateCell({
  label,
  isOffRange,
  date,
  selectedDate,
  setSelectedDate,
  calendarEvents = [],
}) {
  const { isSmSize } = useIsScreenSize();

  if (isOffRange) {
    return null;
  }

  const day = dayjs(date);
  const isToday = day.isToday();
  const isSelectedDay = day.isSame(selectedDate, "day");

  const dayEvents = calendarEvents.filter((event) => {
    const blockTime = event.indexer.blockTime;
    return day.isSame(blockTime, "day");
  });

  const eventsGroup = groupBy(dayEvents, "category");
  const categories = FULLCALENDAR_CATEGORIES.filter((category) =>
    Object.keys(eventsGroup).includes(category),
  );

  label = Number(label);
  if (label === 1) {
    if (!isSmSize) {
      label = `${day.format("MMM")} ${label}`;
    }
  }

  // [category]: {[subCategory]: Event[]}
  const categorySubCategoriesGroup = categories.reduce((value, category) => {
    value[category] = groupBy(eventsGroup[category], "subCategory");
    return value;
  }, {});

  const tooltipContent = !!categories.length && (
    <TooltipContentWrapper>
      {categories.map((category) => {
        const subCategoriesGroup = categorySubCategoriesGroup[category];
        const subCategories = Object.keys(subCategoriesGroup);

        return (
          <div key={category}>
            {category}
            {subCategories?.length && (
              <TooltipSubcategoryWrapper>
                {subCategories.map((subCategory) => {
                  const count = subCategoriesGroup[subCategory]?.length;
                  return (
                    <li key={subCategory}>
                      {subCategory}
                      {count > 1 && `*${count}`}
                    </li>
                  );
                })}
              </TooltipSubcategoryWrapper>
            )}
          </div>
        );
      })}
    </TooltipContentWrapper>
  );

  function onCellClick() {
    setSelectedDate(date);
  }

  return (
    <Tooltip content={tooltipContent}>
      <TooltipChildrenWrapper>
        <CellWrapper
          isToday={isToday}
          isSelectedDay={isSelectedDay}
          onClick={onCellClick}
        >
          <CellLabel>{label}</CellLabel>

          {!!categories.length && (
            <CellEventGroup>
              {!isSmSize ? (
                categories.map((category) => (
                  <FullCalendarCategory
                    key={category}
                    category={category}
                    onlyDot
                  />
                ))
              ) : (
                <FullCalendarCategory color="primaryPurple500" />
              )}
            </CellEventGroup>
          )}
        </CellWrapper>
      </TooltipChildrenWrapper>
    </Tooltip>
  );
}
