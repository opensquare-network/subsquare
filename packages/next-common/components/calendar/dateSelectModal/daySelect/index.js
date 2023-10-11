import React from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import styled from "styled-components";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import CalendarToolbar from "./toolbar";
import CalendarMonthHeader from "./monthHeader";
import CalendarMonthDateCell from "./monthDateCell";

dayjs.extend(timezone);

const localizer = dayjsLocalizer(dayjs);

const CalendarWrapper = styled.div`
  padding: 12px;
  border: 1px solid var(--neutral400);
  border-radius: 4px;

  .rbc-month-view {
    border: none;
    row-gap: 4px;

    .rbc-month-header,
    .rbc-month-row .rbc-row-content .rbc-row {
      column-gap: 4px;
    }

    .rbc-month-header {
      padding-top: 8px;
      padding-bottom: 8px;

      .rbc-header {
        border: none;
        padding-left: 8px;
        padding-right: 8px;
      }
    }

    .rbc-month-row {
      border: none;
      overflow: visible;
      max-height: 48px;
      .rbc-row-bg {
        display: none;
      }
      .rbc-row-content {
        height: 100%;
        .rbc-row {
          height: 100%;
        }
        .rbc-date-cell {
          padding: 0;
        }
        /* events row, hide it */
        .rbc-row .rbc-row-segment {
          display: none;
        }
      }
    }
  }
`;

export default function DaySelect({ date, setDate }) {
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
