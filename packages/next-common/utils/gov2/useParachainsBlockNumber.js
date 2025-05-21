import { useContextApi } from "next-common/context/api";
import { getChainApiAt } from "../getChainApi";
import { useCallback, useEffect, useState } from "react";

export function useParachainsBlockNumber(parachainId, blockHeightOrHash) {
  const api = useContextApi();
  const [parachainsBlockNumber, setParachainsBlockNumber] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const getParaHeadData = useCallback(async () => {
    const atApi = await getChainApiAt(api, blockHeightOrHash);
    return await atApi.query.paras.heads(parachainId);
  }, [api, blockHeightOrHash, parachainId]);

  useEffect(() => {
    if (api && blockHeightOrHash) {
      setIsLoading(true);
      getParaHeadData()
        .then((paraHeadData) => {
          const header = api.registry.createType(
            "Header",
            paraHeadData.unwrap(),
          );
          setParachainsBlockNumber(header.number.toNumber());
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => setIsLoading(false));
    }
  }, [api, blockHeightOrHash, getParaHeadData]);

  return {
    parachainsBlockNumber,
    isLoading,
  };
}
