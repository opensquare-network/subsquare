import { useEffect, useState } from "react";
import useApi from "./useApi";
import usePostTipMeta from "../../context/post/treasury/tip/tipMeta";

export default function useTipMeta(
  tipHash,
  atBlockHeight,
  forceToReadLastBlock = false,
) {
  const [isLoading, setIsLoading] = useState(true);
  const postTipMeta = usePostTipMeta();
  const [tipMeta, setTipMeta] = useState(postTipMeta);
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
      .then((api) => {
        if (api.query.tips) {
          return api.query.tips.tips(tipHash);
        } else if (api.query.treasury?.tips) {
          return api.query.treasury.tips(tipHash);
        }
      })
      .then((tip) => {
        setTipMeta(tip.toJSON());
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [api, tipHash, atBlockHeight, forceToReadLastBlock]);

  return { isLoading, tipMeta };
}
