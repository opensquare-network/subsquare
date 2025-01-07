import { noop } from "lodash-es";
import React, { useEffect, useMemo } from "react";
import { Label, WarningMessage } from "../../../popup/styled";
import useMaxDeposits from "../useMaxDeposits";
import { useContextApi } from "next-common/context/api";
import NumberInput from "next-common/lib/input/number";

export default function SecondPopupInputTimes({
  times: _times,
  setTimes = noop,
  currentTimes = 0,
  setSubmitDisabled = noop,
}) {
  const api = useContextApi();
  const maxDeposits = useMaxDeposits();
  const times = useMemo(() => Number(_times), [_times]);

  const batchCallsLimit = useMemo(
    () => api?.consts?.utility?.batchedCallsLimit?.toNumber?.(),
    [api],
  );

  const isOverLimit =
    times > batchCallsLimit || times + currentTimes >= maxDeposits;
  useEffect(
    () => setSubmitDisabled(isOverLimit),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isOverLimit],
  );

  return (
    <>
      <div>
        <Label>Times</Label>
        <NumberInput value={times} onValueChange={setTimes} />
      </div>

      {isOverLimit && (
        <WarningMessage danger>
          {times > batchCallsLimit
            ? "Over batch calls limit"
            : "Over proposal max deposits"}
        </WarningMessage>
      )}
    </>
  );
}
