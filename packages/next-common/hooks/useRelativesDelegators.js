import { backendApi } from "next-common/services/nextApi";
import { useMemo } from "react";
import { useAsync } from "react-use";

export default function useDelegated(address) {
  const { value, loading } = useAsync(async () => {
    return await backendApi.fetch(`/users/${address}/referenda/delegated`);
  });

  return useMemo(() => {
    const list = value?.result || [];

    const accounts = new Map();
    for (const item of list) {
      if (!accounts.has(item.delegatee)) {
        accounts.set(item.delegatee, {
          account: item.delegatee,
          tracks: new Map(),
        });
      }
      accounts.get(item.delegatee).tracks.set(item.trackId, item);
    }

    return {
      result: Array.from(accounts.values()),
      loading,
    };
  }, [loading, value?.result]);
}

export function useDelegators(address) {
  const { value, loading } = useAsync(async () => {
    return await backendApi.fetch(`users/${address}/referenda/delegators`);
  });

  return useMemo(() => {
    const list = value?.result || [];

    const accounts = new Map();
    for (const item of list) {
      if (!accounts.has(item.account)) {
        accounts.set(item.account, {
          account: item.account,
          tracks: new Map(),
        });
      }
      accounts.get(item.account).tracks.set(item.trackId, item);
    }

    return {
      result: Array.from(accounts.values()),
      loading,
    };
  }, [loading, value?.result]);
}
