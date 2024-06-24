import { useEffect, useState } from "react";
import { useMountedState } from "react-use";
import useCouncilName from "next-common/hooks/useCouncilName";
import { useContextApi } from "next-common/context/api";

export default function usePrime(blockHash) {
  const [prime, setPrime] = useState();
  const councilName = useCouncilName();
  const isMounted = useMountedState();
  const api = useContextApi();

  useEffect(() => {
    if (!api) return;

    (blockHash ? api.at(blockHash) : Promise.resolve(api))
      .then((blockApi) => {
        return blockApi.query[councilName]?.prime?.();
      })
      .then((prime) => {
        if (!prime) return;

        if (isMounted()) {
          setPrime(prime.toJSON());
        }
      });
  }, [api, blockHash, councilName, isMounted]);

  return prime;
}
