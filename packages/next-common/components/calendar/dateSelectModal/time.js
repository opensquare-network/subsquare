import React, { useEffect, useState } from "react";
import Labeled from "../../../components/Labeled";
import noop from "lodash.noop";
import LineInput from "../../lineInput";
import Flex from "../../styled/flex";

export default function Time({
  defaultHour = 0,
  defaultMinute = 0,
  onChange = noop,
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
  }, [hour, minute]);

  return (
    <Labeled text={"Time"}>
      <Flex>
        <LineInput
          style={{ textAlign: "center" }}
          placeholder="00"
          value={hour}
          setValue={setHour}
        />
        <span style={{ padding: 8 }}>:</span>
        <LineInput
          style={{ textAlign: "center" }}
          placeholder="00"
          value={minute}
          setValue={setMinute}
        />
      </Flex>
    </Labeled>
  );
}
