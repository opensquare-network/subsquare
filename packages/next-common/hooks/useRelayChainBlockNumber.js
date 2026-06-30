import { useEffect, useState } from "react";
import { useRelayChainApi } from "next-common/context/relayChain";

export default function useRelayChainBlockNumber() {
  const api = useRelayChainApi();
  const [blockNumber, setBlockNumber] = useState(null);

  useEffect(() => {
    if (!api) {
      return;
    }

    let unsubscribe;
    let isMounted = true;

    api.rpc.chain
      .subscribeNewHeads((header) => {
        if (isMounted) {
          setBlockNumber(header.number.toNumber());
        }
      })
      .then((unsub) => {
        if (isMounted) {
          unsubscribe = unsub;
        } else {
          unsub();
        }
      });

    return () => {
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [api]);

  return blockNumber;
}
