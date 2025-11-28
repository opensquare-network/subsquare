import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";

export default function useCallDetail(callHex) {
  const api = useContextApi();
  const [call, setCall] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!api || !callHex) {
      return;
    }
    setIsLoading(true);
    try {
      const callType = api.registry.createType("Call", callHex);
      setCall(callType);
    } finally {
      setIsLoading(false);
    }
  }, [api, callHex]);

  return { call, isLoading };
}
