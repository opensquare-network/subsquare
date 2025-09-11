import { useState, useEffect } from "react";
import { useContextApi } from "next-common/context/api";

export function useProxyTypeOptions() {
  const api = useContextApi();
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!api) {
      return;
    }

    try {
      const meta = api.tx.proxy.addProxy.meta.args[1];
      const typeDef = api.registry.createType(meta.type.toString());
      const proxyTypes = typeDef.defKeys.filter(
        (type) => !type.startsWith("__Unused"),
      );

      setOptions(proxyTypes);
    } catch (err) {
      setOptions([]);
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  return {
    options,
    isLoading,
  };
}
