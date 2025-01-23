import { useState, useEffect } from "react";
import { BlockHeightProvider } from "next-common/context/blockHeight";
import { useCollectivesApi } from "next-common/context/collectives/api";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";

export function useCoreFellowshipParams(api) {
  const corePallet = useCoreFellowshipPallet();
  const [params, setParams] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!api) {
      return;
    }
    (async () => {
      const params = await api.query[corePallet].params();
      setParams(params.toJSON());
      setIsLoading(false);
    })();
  }, [api, corePallet]);

  return { params, isLoading };
}

export function CollectivesBlockHeightProvider({ children }) {
  const api = useCollectivesApi();
  return <BlockHeightProvider api={api}>{children}</BlockHeightProvider>;
}
