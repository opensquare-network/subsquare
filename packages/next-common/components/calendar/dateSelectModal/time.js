import React, { useEffect, useState } from "react";
import Labeled from "../../../components/Labeled";
import { noop } from "lodash-es";
import NumberInput from "next-common/lib/input/number";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hour, minute]);

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
