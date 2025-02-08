import useCallFromHex from "next-common/utils/hooks/useCallFromHex";
import CallTree from "next-common/components/proposal/callTree";
import { useEffect } from "react";
import { useMultisigSignContext } from "./context";

export default function ProposeTree() {
  const {
    multisig: { callHex, when },
    setValue,
  } = useMultisigSignContext();

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
