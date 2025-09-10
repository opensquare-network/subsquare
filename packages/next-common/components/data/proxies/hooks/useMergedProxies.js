import { useState, useEffect } from "react";

export default function useMergedProxies({
  serverProxies,
  onChainProxies,
  serverLoading,
  onChainLoading,
}) {
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
