import React, { useCallback, useState } from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import styled from "styled-components";
import PopupWithAddress from "../../../components/popupWithAddress";
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

  return (
    <>
      <Day date={date} setDate={setDate} />
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
    <PopupWithAddress title="Select Time" Component={PopupContent} {...props} />
  );
}
