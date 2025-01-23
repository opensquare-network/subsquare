import { useCollectivesApi } from "next-common/context/collectives/api";

const {
  useCoreFellowshipPallet,
} = require("next-common/context/collectives/collectives");
const { useState, useEffect, createContext, useContext } = require("react");

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

const CollectivesBlockHeightContext = createContext();

export function CollectivesBlockHeightProvider({ children }) {
  const { blockHeight, isLoading } = useSubCollectivesBlockHeight();
  return (
    <CollectivesBlockHeightContext.Provider value={{ blockHeight, isLoading }}>
      {children}
    </CollectivesBlockHeightContext.Provider>
  );
}

export function useCollectivesBlockHeight() {
  return useContext(CollectivesBlockHeightContext);
}

export function useSubCollectivesBlockHeight() {
  const api = useCollectivesApi();
  const [isLoading, setIsLoading] = useState(true);
  const [blockHeight, setBlockHeight] = useState(null);

  useEffect(() => {
    if (!api) {
      return;
    }
    let unsub = null;
    api.rpc.chain
      .subscribeNewHeads((lastHeader) => {
        setBlockHeight(lastHeader.number.toNumber());
        setIsLoading(false);
      })
      .then((unsubFunc) => {
        unsub = unsubFunc;
      });

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api]);

  return { blockHeight, isLoading };
}
