import React from "react";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import { groupBy } from "lodash-es";
import Tooltip from "../../tooltip";
import FullCalendarCategory from "./category";
import {
  FULLCALENDAR_CATEGORIES,
  FULLCALENDAR_CATEGORY_PARACHAIN,
  FULLCALENDAR_CATEGORY_SCHEDULER,
  FULLCALENDAR_CATEGORY_SOCIETY,
  FULLCALENDAR_CATEGORY_STAKING,
} from "./consts";
import { cn } from "next-common/utils";
dayjs.extend(isToday);

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
  calendarUserEvents = [],
  futureEvents = [],
}) {
  label = Number(label);

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

  const dayUserEvents = calendarUserEvents
    .filter((event) => {
      const timestamp = event.timestamp;
      return day.isSame(timestamp, "day");
    })
    .map((item) => {
      return {
        ...item,
        type: "userEvent",
        category: "Others",
        subCategory: "User Event",
      };
    });

  const dayFutureEvents = futureEvents
    .filter((event) => {
      const blockTime = event.indexer.blockTime;
      return day.isSame(blockTime, "day");
    })
    .map((item) => {
      if (
        ![
          FULLCALENDAR_CATEGORY_PARACHAIN,
          FULLCALENDAR_CATEGORY_SCHEDULER,
          FULLCALENDAR_CATEGORY_STAKING,
          FULLCALENDAR_CATEGORY_SOCIETY,
        ].includes(item.category)
      ) {
        return item;
      }
      return {
        ...item,
        category: "Others",
        subCategory: item.category,
      };
    });

  const eventsGroup = groupBy(
    [...dayEvents, ...dayUserEvents, ...dayFutureEvents],
    "category",
  );
  const categories = FULLCALENDAR_CATEGORIES.filter((category) =>
    Object.keys(eventsGroup).includes(category),
  );

  // [category]: {[subCategory]: Event[]}
  const categorySubCategoriesGroup = categories.reduce((value, category) => {
    value[category] = groupBy(eventsGroup[category], "subCategory");
    return value;
  }, {});

  const tooltipContent = !!categories.length && (
    <div className="text12Medium text-left">
      {categories.map((category) => {
        const subCategoriesGroup = categorySubCategoriesGroup[category];
        const subCategories = Object.keys(subCategoriesGroup);

        return (
          <div key={category}>
            {category}
            {subCategories?.length && (
              <ul>
                {subCategories.map((subCategory) => {
                  const count = subCategoriesGroup[subCategory]?.length;
                  return (
                    <li
                      key={subCategory}
                      className="pl-1 before:content-['•'] before:mr-1"
                    >
                      {subCategory}
                      {count > 1 && `*${count}`}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );

  function onCellClick() {
    setSelectedDate(date);
  }

  return (
    <Tooltip content={tooltipContent} className="block h-full">
      <div className="h-full">
        <div
          className={cn(
            "group",
            "w-full h-12",
            "flex flex-col justify-between",
            "p-2 border border-neutral300 rounded",
            "text-left",
            "hover:border-neutral500",
            isToday && "border-theme500",
            isSelectedDay && "border-theme500 hover:border-theme500",
          )}
          role="button"
          onClick={onCellClick}
        >
          <p
            className={cn(
              "text12Bold text-textSecondary",
              isSelectedDay && "text-theme500",
            )}
          >
            {label === 1 && (
              <span className="max-sm:hidden">{day.format("MMM")} </span>
            )}
            {label}
          </p>

          {!!categories.length && (
            <>
              <div className="flex gap-x-1 max-sm:hidden">
                {categories.map((category) => (
                  <FullCalendarCategory
                    key={category}
                    category={category}
                    onlyDot
                  />
                ))}
              </div>
              <div className="hidden max-sm:block">
                <FullCalendarCategory color="var(--theme500)" />
              </div>
            </>
          )}
        </div>
      </div>
    </Tooltip>
  );
}
