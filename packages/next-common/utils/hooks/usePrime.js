import { useEffect, useState } from "react";
import useIsMounted from "./useIsMounted";
import useCouncilName from "next-common/hooks/useCouncilName";
import { useContextApi } from "next-common/context/api";

export default function usePrime(blockHash) {
  const [prime, setPrime] = useState();
  const councilName = useCouncilName();
  const isMounted = useIsMounted();
  const api = useContextApi();

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
