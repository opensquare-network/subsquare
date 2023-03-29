import React from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import styled from "styled-components";
import {
  gap_x,
  gap_y,
  hidden,
  h_full,
  max_h,
  p,
  p_x,
  p_y,
} from "../../../../styles/tailwindcss";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import CalendarToolbar from "./toolbar";
import CalendarMonthHeader from "./monthHeader";
import CalendarMonthDateCell from "./monthDateCell";

dayjs.extend(timezone);

const localizer = dayjsLocalizer(dayjs);

const CalendarWrapper = styled.div`
  padding: 12px;
  border: 1px solid ${p => p.theme.grey300Border};
  border-radius: 4px;

  .rbc-month-view {
    border: none;
    ${gap_y(4)}

    .rbc-month-header,
    .rbc-month-row .rbc-row-content .rbc-row {
      ${gap_x(4)}
    }

    .rbc-month-header {
      ${p_y(8)}

      .rbc-header {
        border: none;
        ${p_x(8)}
      }
    }

    .rbc-month-row {
      border: none;
      overflow: visible;
      ${max_h(48)}
      .rbc-row-bg {
        ${hidden}
      }
      .rbc-row-content {
        ${h_full}
        .rbc-row {
          ${h_full}
        }
        .rbc-date-cell {
          ${p(0)}
        }
        /* events row, hide it */
        .rbc-row .rbc-row-segment {
          ${hidden};
        }
      }
    }
  }
`;

export default function DaySelect({
  date,
  setDate,
}) {
  const components = {
    toolbar(props) {
      return <CalendarToolbar {...props} />;
    },
    month: {
      header: CalendarMonthHeader,
      dateHeader(props) {
        return (
          <CalendarMonthDateCell
            {...props}
            selectedDate={date}
            setSelectedDate={setDate}
          />
        );
      },
    },
  };

  function onNavigate(newDate) {
    setDate(newDate);
  }

  return (
    <CalendarWrapper>
      <Calendar
        localizer={localizer}
        components={components}
        date={date}
        onNavigate={onNavigate}
        defaultView="month"
        views={["month"]}
      />
    </CalendarWrapper>
  );
}
