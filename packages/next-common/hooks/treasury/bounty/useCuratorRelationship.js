import { isNil } from "lodash-es";
import { useContextApi } from "next-common/context/api";
import { useIsPureProxy } from "next-common/hooks/profile/useFetchProfileProxies";
import { useMemo } from "react";
import { useAsync } from "react-use";
import { fetchMultisigData } from "./useCuratorMultisigAddress";

const EMPTY_RESULT = {
  proxies: [],
  loading: false,
};

export default function useCuratorRelationship(address) {
  const api = useContextApi();

  const { value: proxies, loading: proxiesLoading } = useAsync(async () => {
    if (isNil(address)) {
      return;
    }

    const data = await api.query.proxy.proxies(address);
    const [proxies] = data.toJSON() || [];

    return proxies;
  });

  if (isNil(address)) {
    return EMPTY_RESULT;
  }

  return {
    proxies,
    loading: proxiesLoading,
  };
}

const EMPTY_CURATOR = {
  isPure: false,
  isProxy: false,
  isMultisig: false,
  proxies: [],
  multisigData: {
    badge: "",
    signatories: [],
  },
  isLoading: false,
};

export function useCuratorAddress(address) {
  const api = useContextApi();

  const { value: proxies, loading: proxiesLoading } = useAsync(async () => {
    if (isNil(address)) {
      return EMPTY_CURATOR.proxies;
    }

    const data = await api.query.proxy.proxies(address);
    const [proxies] = data.toJSON() || [];

    return proxies || [];
  }, []);

  const { isPure, isLoading: isPureLoading } = useIsPureProxy(address);

  const { value: multisigData, loading: multisigLoading } = useAsync(
    async () => await fetchMultisigData(address),
    [address],
  );

  const isLoading = useMemo(() => {
    return proxiesLoading || isPureLoading || multisigLoading;
  }, [proxiesLoading, isPureLoading, multisigLoading]);

  return {
    isPure,
    isProxy: proxies?.length > 0,
    proxies,
    isMultisig: multisigData?.signatories?.length > 0,
    multisigData,
    isLoading,
  };
}
