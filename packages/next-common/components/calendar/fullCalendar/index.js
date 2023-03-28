import dayjs from "dayjs";
import React, { useState } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import styled from "styled-components";
import { shadow_100 } from "../../../styles/componentCss";
import {
  flex,
  flex_col,
  gap_x,
  gap_y,
  hidden,
  h_full,
  max_h,
  p,
  p_x,
  p_y,
} from "../../../styles/tailwindcss";
import { NeutralPanel } from "../../styled/containers/neutralPanel";
import timezone from "dayjs/plugin/timezone";
import FullCalendarToolbar from "./toolbar";
import FullCalendarMonthDateCell from "./monthDateCell";
import noop from "lodash.noop";
import { useCalendarEventsSummary } from "../../../hooks/calendar";
import FullCalendarFooter from "./footer";
import FullCalendarMonthHeader from "./monthHeader";
import CreateEventModal from "../createEventModal";
dayjs.extend(timezone);

const localizer = dayjsLocalizer(dayjs);

const Wrapper = styled(NeutralPanel)`
  ${p_x(24)}
  ${p_y(20)}
  ${shadow_100}
  ${flex}
  ${flex_col}
  ${gap_y(16)}
`;

const CalendarWrapper = styled.div`
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

export default function FullCalendar({
  date,
  setDate = noop,
  selectedDate,
  setSelectedDate = noop,
  futureEvents = [],
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
            futureEvents={futureEvents}
          />
        );
      },
    },
  };

  return (
    <Wrapper>
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
        <CreateEventModal onClose={() => setShowCreateEventModal(false)} />
      )}
    </Wrapper>
  );
}
