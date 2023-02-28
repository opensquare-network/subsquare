import dayjs from "dayjs";
import React from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styled from "styled-components";
import { shadow_100 } from "../../../styles/componentCss";
import {
  flex,
  flex_col,
  gap_y,
  h,
  p_x,
  p_y,
} from "../../../styles/tailwindcss";
import { NeutralPanel } from "../../styled/containers/neutralPanel";
import timezone from "dayjs/plugin/timezone";
import FullCalendarToolbar from "./toolbar";
dayjs.extend(timezone);

const localizer = dayjsLocalizer(dayjs);

const CalendarNeutralPanel = styled(NeutralPanel)`
  ${p_x(24)}
  ${p_y(20)} 
  ${shadow_100} 
  ${flex} 
  ${flex_col} 
  ${gap_y(16)}
  ${h(356)}
`;

export default function FullCalendar({ defaultDate = new Date() }) {
  const max = dayjs().endOf("day").subtract(1, "hours").toDate();

  const components = {
    toolbar: FullCalendarToolbar,
  };

  return (
    <CalendarNeutralPanel>
      <Calendar
        localizer={localizer}
        components={components}
        defaultDate={defaultDate}
        view="month"
        views={["month"]}
        max={max}
      />
    </CalendarNeutralPanel>
  );
}
