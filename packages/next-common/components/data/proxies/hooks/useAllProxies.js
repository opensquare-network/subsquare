import { useState, useEffect } from "react";
import useAllServerProxies from "next-common/hooks/useAllServerProxies";
import useAllOnChainProxies from "next-common/hooks/useAllOnChainProxies";

export default function useAllProxies() {
  const { proxies: serverProxies, loading: serverLoading } =
    useAllServerProxies();
  const { proxies: onChainProxies, loading: onChainLoading } =
    useAllOnChainProxies();

  const [proxies, setProxies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (serverLoading && onChainLoading) {
      return;
    }

    if (!serverLoading && serverProxies?.length > 0) {
      setProxies(serverProxies);
      setLoading(false);
    }

    if (!onChainLoading && onChainProxies?.length > 0) {
      const areProxiesEqual =
        JSON.stringify(serverProxies) === JSON.stringify(onChainProxies);

      if (!areProxiesEqual) {
        setProxies(onChainProxies);
      }
      setLoading(false);
    }

    if (!serverLoading && !onChainLoading) {
      setLoading(false);
    }
  }, [serverProxies, serverLoading, onChainProxies, onChainLoading]);

  return { proxies, loading };
}
