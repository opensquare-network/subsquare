import { useEffect, useState } from "react";
import { hexToU8a } from "@polkadot/util";
import useBlockApi from "next-common/utils/hooks/useBlockApi";

export default function useCallFromHex(callHex, blockHeight) {
  const blockApi = useBlockApi(blockHeight);
  const [isLoading, setIsLoading] = useState(true);
  const [call, setCall] = useState();

  useEffect(() => {
    if (!blockApi || !callHex) {
      return;
    }

    try {
      const bytes = hexToU8a(callHex);
      setCall(blockApi.registry.createType("Call", bytes));
    } finally {
      setIsLoading(false);
    }
  }, [blockApi, callHex]);

  return {
    call,
    isLoading,
  };
}
