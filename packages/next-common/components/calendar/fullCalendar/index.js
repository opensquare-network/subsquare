import dayjs from "dayjs";
import React, { useState } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styled from "styled-components";
import { p_12_bold, shadow_100 } from "../../../styles/componentCss";
import {
  flex,
  flex_col,
  gap_x,
  gap_y,
  h,
  hidden,
  h_full,
  max_h,
  p,
  p_x,
  p_y,
  text_tertiary,
  text_uppercase,
} from "../../../styles/tailwindcss";
import { NeutralPanel } from "../../styled/containers/neutralPanel";
import timezone from "dayjs/plugin/timezone";
import FullCalendarToolbar from "./toolbar";
import FullCalendarMonthDateCell from "./monthDateHeader";
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
  ${h(412)}

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
        text-align: left;
        ${p_x(8)}
        ${p_12_bold}
        ${text_tertiary}
        ${text_uppercase}
      }
    }

    .rbc-month-row {
      border: none;
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
      }
    }
  }
`;

export default function FullCalendar({ defaultDate = new Date() }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const components = {
    toolbar: FullCalendarToolbar,
    month: {
      dateHeader(props) {
        return (
          <FullCalendarMonthDateCell
            {...props}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
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
          defaultDate={defaultDate}
          defaultView="month"
          views={["month"]}
        />
      </CalendarWrapper>
    </Wrapper>
  );
}
