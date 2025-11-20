import React, { useCallback, useState } from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import Popup from "../../../components/popup/wrapper/Popup";
import PrimaryButton from "next-common/lib/button/primary";
import { noop } from "lodash-es";
import Day from "./day";
import { PopupButtonWrapper } from "../../popup/wrapper";

dayjs.extend(timezone);

function PopupContent({ defaultSelectedDate, onSelect = noop, onClose }) {
  const [date, setDate] = useState(defaultSelectedDate || new Date());

  const onDayChange = useCallback((selectedDate) => {
    setDate(dayjs(selectedDate).toDate());
  }, []);

  return (
    <>
      <Day date={date} setDate={onDayChange} />

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

export default function DateOnlySelectModal(props) {
  return (
    <Popup title="Select Date" {...props}>
      <PopupContent {...props} />
    </Popup>
  );
}
