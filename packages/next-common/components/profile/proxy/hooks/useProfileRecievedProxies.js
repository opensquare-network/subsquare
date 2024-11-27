import { useState, useEffect, useMemo } from "react";
import useAllServerProxies from "next-common/hooks/useAllServerProxies";
import useAllOnChainProxies from "next-common/hooks/useAllOnChainProxies";

export default function useProfileRecievedProxies(address) {
  const { proxies: serverProxies, loading: serverLoading } =
    useAllServerProxies();
  const { proxies: onChainProxies, loading: onChainLoading } =
    useAllOnChainProxies();

  const [proxies, setProxies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (serverLoading) {
      return;
    }

    setProxies(serverProxies);
    setLoading(false);
  }, [serverProxies, serverLoading]);

  useEffect(() => {
    if (onChainLoading || serverLoading) {
      return;
    }

    if (onChainProxies?.length === 0) {
      return;
    }

    const areProxiesEqual =
      JSON.stringify(serverProxies) === JSON.stringify(onChainProxies);

    if (areProxiesEqual) {
      return;
    }

    setProxies(onChainProxies);
  }, [onChainProxies, onChainLoading, serverProxies, serverLoading]);

  const recievedProxies = useMemo(() => {
    return proxies.filter((item) => item?.delegatee == address);
  }, [proxies, address]);

  return { proxies: recievedProxies, loading };
}
