import React, { useCallback, useState } from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import styled from "styled-components";
import Popup from "../../../components/popup/wrapper/Popup";
import SecondaryButton from "../../buttons/secondaryButton";
import noop from "lodash.noop";
import Day from "./day";
import Time from "./time";

dayjs.extend(timezone);

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

function PopupContent({ defaultSelectedDate, onSelect = noop, onClose }) {
  const [date, setDate] = useState(defaultSelectedDate || new Date());
  const hour = dayjs(date).hour();
  const minute = dayjs(date).minute();

  const onTimeChange = useCallback((hour, minute) => {
    setDate((date) => {
      const newDate = dayjs(date)
        .set("hour", hour)
        .set("minute", minute)
        .toDate();
      return newDate;
    });
  }, []);

  const onDayChange = useCallback((selectedDate) => {
    setDate((date) => {
      const oldDate = dayjs(date);
      const newDate = dayjs(selectedDate)
        .set("hour", oldDate.hour())
        .set("minute", oldDate.minute())
        .toDate();
      return newDate;
    });
  }, []);

  return (
    <>
      <Day date={date} setDate={onDayChange} />
      <Time defaultHour={hour} defaultMinute={minute} onChange={onTimeChange} />

      <ButtonWrapper>
        <SecondaryButton
          onClick={() => {
            onSelect(date);
            onClose();
          }}
        >
          Confirm
        </SecondaryButton>
      </ButtonWrapper>
    </>
  );
}

export default function DateSelectModal(props) {
  return (
    <Popup title="Select Time" {...props}>
      <PopupContent {...props} />
    </Popup>
  );
}
