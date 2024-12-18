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
    if (!serverLoading) {
      setProxies(serverProxies);
      setLoading(false);
    }

    if (!onChainLoading && !serverLoading) {
      const areProxiesEqual =
        JSON.stringify(serverProxies) === JSON.stringify(onChainProxies);

      if (!areProxiesEqual) {
        setProxies(onChainProxies);
      }
    }
  }, [serverProxies, serverLoading, onChainProxies, onChainLoading]);

  return { proxies, loading };
}
