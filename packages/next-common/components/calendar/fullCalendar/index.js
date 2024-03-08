import dayjs from "dayjs";
import React, { useState } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import styled from "styled-components";
import { NeutralPanel } from "../../styled/containers/neutralPanel";
import timezone from "dayjs/plugin/timezone";
import FullCalendarToolbar from "./toolbar";
import FullCalendarMonthDateCell from "./monthDateCell";
import { noop } from "lodash-es";
import { useCalendarEventsSummary } from "../../../hooks/calendar";
import FullCalendarFooter from "./footer";
import FullCalendarMonthHeader from "./monthHeader";
import CreateEventModal from "../createEventModal";
dayjs.extend(timezone);

const localizer = dayjsLocalizer(dayjs);

const CalendarWrapper = styled.div`
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

export default function FullCalendar({
  date,
  setDate = noop,
  selectedDate,
  setSelectedDate = noop,
  futureEvents = [],
  monthUserEvents = [],
  refresh = noop,
}) {
  const [calendarEvents] = useCalendarEventsSummary(date, "month");
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);

  function onNavigate(newDate) {
    setDate(newDate);
  }

  /** @type {import("react-big-calendar").Components} */
  const components = {
    toolbar(props) {
      return (
        <FullCalendarToolbar
          {...props}
          setSelectedDate={setSelectedDate}
          onCreateEvent={() => setShowCreateEventModal(true)}
        />
      );
    },
    month: {
      header: FullCalendarMonthHeader,
      dateHeader(props) {
        return (
          <FullCalendarMonthDateCell
            {...props}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            calendarEvents={calendarEvents}
            calendarUserEvents={monthUserEvents}
            futureEvents={futureEvents}
          />
        );
      },
    },
  };

  return (
    <NeutralPanel className="flex flex-col gap-y-4 px-6 py-5">
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
      <FullCalendarFooter />
      {showCreateEventModal && (
        <CreateEventModal
          onClose={() => setShowCreateEventModal(false)}
          refresh={refresh}
        />
      )}
    </NeutralPanel>
  );
}
