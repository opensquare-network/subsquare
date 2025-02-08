import useCallFromHex from "next-common/utils/hooks/useCallFromHex";
import CallTree from "next-common/components/proposal/callTree";
import { useEffect } from "react";

export default function ProposeTree({ callHex, when, setValue }) {
  const { call, isLoading } = useCallFromHex(callHex, when?.height);

  useEffect(() => {
    if (!setValue) {
      return;
    }


    setValue({ isValid: !isLoading, data: { method: call } });

    return () => {
      setValue({ isValid: false, data: {} });
    };
  }, [call, isLoading, setValue]);

  return <CallTree call={call} isLoading={isLoading} />;
}
