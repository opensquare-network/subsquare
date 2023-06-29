import { useEffect, useState } from "react";
import useIsMounted from "./useIsMounted";
import useApi from "./useApi";
import useCouncilName from "next-common/hooks/useCouncilName";

export default function usePrime(blockHash) {
  const [prime, setPrime] = useState();
  const councilName = useCouncilName();
  const isMounted = useIsMounted();
  const api = useApi();

  useEffect(() => {
    if (!api) return;

    (blockHash ? api.at(blockHash) : Promise.resolve(api))
      .then((blockApi) => {
        return blockApi.query[councilName]?.prime?.();
      })
      .then((prime) => {
        if (!prime) return;

        if (isMounted.current) {
          setPrime(prime.toJSON());
        }
      });
  }, [api, blockHash, councilName, isMounted]);

  return prime;
}
