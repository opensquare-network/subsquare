import React, { useEffect, useState } from "react";
import Labeled from "../../../components/Labeled";
import { noop } from "lodash-es";
import NumberInput from "next-common/lib/input/number";
import Flex from "../../styled/flex";
import TimeSelectPicker from "next-common/components/timeSelectPicker";

// mode: "input" | "select"
export default function Time({
  defaultHour = 0,
  defaultMinute = 0,
  onChange = noop,
  mode = "input",
}) {
  const [hour, setHour] = useState(`${defaultHour}`);
  const [minute, setMinute] = useState(`${defaultMinute}`);

  useEffect(() => {
    if (!hour || !minute) {
      return;
    }

    let h = parseInt(hour);
    let m = parseInt(minute);

    h = Math.max(0, Math.min(h, 23));
    m = Math.max(0, Math.min(m, 59));

    onChange(h, m);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hour, minute]);

  const handleHourChange = (value) => {
    setHour(typeof value === "number" ? `${value}` : value);
  };

  const handleMinuteChange = (value) => {
    setMinute(typeof value === "number" ? `${value}` : value);
  };

  if (mode === "select") {
    return (
      <div className="flex items-center gap-4">
        <span className="text14Bold text-textPrimary">Time</span>
        <div className="flex-1 flex justify-start">
          <TimeSelectPicker
            hour={parseInt(hour) || 0}
            minute={parseInt(minute) || 0}
            onHourChange={handleHourChange}
            onMinuteChange={handleMinuteChange}
          />
        </div>
      </div>
    );
  }

  return (
    <Labeled text={"Time"}>
      <Flex>
        <div className="grow">
          <NumberInput
            className="flex w-full"
            controls={false}
            style={{ textAlign: "center" }}
            placeholder="00"
            value={hour}
            onValueChange={setHour}
          />
        </div>
        <span style={{ padding: 8 }}>:</span>
        <div className="grow">
          <NumberInput
            className="flex w-full"
            controls={false}
            style={{ textAlign: "center" }}
            placeholder="00"
            value={minute}
            onValueChange={setMinute}
          />
        </div>
      </Flex>
    </Labeled>
  );
}
