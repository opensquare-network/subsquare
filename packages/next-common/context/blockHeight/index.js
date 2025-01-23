import { createContext, useContext, useEffect, useState } from "react";

const BlockHeightContext = createContext();

export function BlockHeightProvider({ api, children }) {
  const { blockHeight, isLoading } = useSubBlockHeight(api);
  return (
    <BlockHeightContext.Provider value={{ blockHeight, isLoading }}>
      {children}
    </BlockHeightContext.Provider>
  );
}

export function useBlockHeight() {
  return useContext(BlockHeightContext);
}

export function useSubBlockHeight(api) {
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
