import useCallFromHex from "next-common/utils/hooks/useCallFromHex";
import CallTree from "next-common/components/proposal/callTree";
import { useEffect } from "react";
import { noop } from "lodash-es";

export default function ProposeTree({ callHex, when, setValue = noop }) {
  return <ProposeTreeWithContext callHex={callHex} setValue={setValue} />;
}

function ProposeTreeWithContext({ callHex, setValue = noop }) {
  const { call, isLoading } = useCallFromHex(callHex);

  useEffect(() => {
    if (!setValue) {
      return;
    }

    setValue({ isValid: !isLoading, data: call });
  }, [call, isLoading, setValue]);

  return <CallTree call={call} isLoading={isLoading} />;
}
