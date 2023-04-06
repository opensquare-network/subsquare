import noop from "lodash.noop";
import React, { useEffect, useMemo } from "react";
import useApi from "../../../../utils/hooks/useApi";
import InputNumber from "../../../inputNumber";
import { WarningMessage, Label } from "../../../popup/styled";

export default function SecondPopupInputTimes({
  times,
  setTimes = noop,
  setSubmitDisabled = noop,
}) {
  const api = useApi();

  const limit = useMemo(
    () => api?.consts?.utility?.batchedCallsLimit?.toNumber?.(),
    [api],
  );

  const isOverLimit = times > limit;

  useEffect(() => setSubmitDisabled(isOverLimit), [isOverLimit]);

  return (
    <>
      <div>
        <Label>Times</Label>
        <InputNumber value={times} setValue={setTimes} min={1} />
      </div>

      {isOverLimit && (
        <WarningMessage danger>Number is not valid</WarningMessage>
      )}
    </>
  );
}
