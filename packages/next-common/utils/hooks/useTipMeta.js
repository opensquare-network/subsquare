import { useEffect, useState } from "react";
import useApi from "./useApi";

export default function useTipMeta(
  tipHash,
  atBlockHeight,
  forceToReadLastBlock = false
) {
  const [isLoading, setIsLoading] = useState(true);
  const [tipMeta, setTipMeta] = useState();
  const api = useApi();

  useEffect(() => {
    if (!api) {
      return;
    }

    setIsLoading(true);

    Promise.resolve(api)
      .then((api) => {
        if (!forceToReadLastBlock && atBlockHeight) {
          return api.rpc.chain
            .getBlockHash(atBlockHeight)
            .then((blockHash) => api.at(blockHash));
        }
        return api;
      })
      .then((api) => api.query.tips.tips(tipHash))
      .then((tip) => {
        setTipMeta(tip.toJSON());
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [api, tipHash, atBlockHeight, forceToReadLastBlock]);

  return { isLoading, tipMeta };
}
