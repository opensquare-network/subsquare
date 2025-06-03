import { useEffect, useState } from "react";
import { hexToU8a } from "@polkadot/util";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";

export function useCallFromHexIndexer(blockHeight) {
  if (!blockHeight) {
    return null;
  }

  return {
    blockHeight,
  };
}

export default function useCallFromHex(callHex) {
  const blockApi = useConditionalContextApi();
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
