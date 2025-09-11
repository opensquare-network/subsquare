import { flatten } from "lodash-es";
import { useContextApi } from "next-common/context/api";
import useCall from "next-common/utils/hooks/useCall";
import { useMemo } from "react";

export default function useAllOnChainProxies() {
  const api = useContextApi();
  const { value: proxies, loading } = useCall(
    api?.query.proxy?.proxies.entries,
    [],
  );

  const flattenProxies = useMemo(() => {
    return flatten(
      (proxies || []).map(([key, value]) =>
        (value[0] || []).map((delegatee) => ({
          delegator: key.args?.[0]?.toString(),
          delegatee: delegatee.delegate?.toString(),
          proxyType: delegatee.proxyType?.toString(),
          delay: delegatee.delay?.toNumber(),
        })),
      ),
    );
  }, [proxies]);

  return { proxies: flattenProxies, loading };
}
