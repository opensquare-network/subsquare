import noop from "lodash.noop";
import React, { useEffect, useMemo } from "react";
import useApi from "../../../../utils/hooks/useApi";
import InputNumber from "../../../inputNumber";
import { Label, WarningMessage } from "../../../popup/styled";
import useMaxDeposits from "../useMaxDeposits";

export default function SecondPopupInputTimes({
  times,
  setTimes = noop,
  currentTimes = 0,
  setSubmitDisabled = noop,
}) {
  const api = useApi();
  const maxDeposits = useMaxDeposits();

  const batchCallsLimit = useMemo(
    () => api?.consts?.utility?.batchedCallsLimit?.toNumber?.(),
    [api],
  );

  const isOverLimit = times > batchCallsLimit || times + currentTimes >= maxDeposits;
  useEffect(() => setSubmitDisabled(isOverLimit), [isOverLimit]);

  return (
    <>
      <div>
        <Label>Times</Label>
        <InputNumber value={times} setValue={setTimes} min={1} />
      </div>

      {isOverLimit && (
        <WarningMessage danger>
          { times > batchCallsLimit ? "Over batch calls limit" : "Over proposal max deposits" }
        </WarningMessage>
      )}
    </>
  );
}
