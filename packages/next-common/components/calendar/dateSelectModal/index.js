import React, { useCallback, useState } from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import Popup from "../../../components/popup/wrapper/Popup";
import PrimaryButton from "next-common/lib/button/primary";
import { noop } from "lodash-es";
import Day from "./day";
import Time from "./time";
import { PopupButtonWrapper } from "../../popup/wrapper";

dayjs.extend(timezone);

function PopupContent({
  defaultSelectedDate,
  onSelect = noop,
  onClose,
  mode = "input",
}) {
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
      <Time
        defaultHour={hour}
        defaultMinute={minute}
        onChange={onTimeChange}
        mode={mode}
      />

      <PopupButtonWrapper>
        <PrimaryButton
          onClick={() => {
            onSelect(date);
            onClose();
          }}
        >
          Confirm
        </PrimaryButton>
      </PopupButtonWrapper>
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
