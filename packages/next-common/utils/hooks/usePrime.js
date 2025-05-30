import { useEffect, useState } from "react";
import { useMountedState } from "react-use";
import { useContextApi } from "next-common/context/api";
import { useCollectivePallet } from "next-common/context/collective";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";

export default function usePrime(blockHash) {
  const [prime, setPrime] = useState();
  const pallet = useCollectivePallet();
  const isMounted = useMountedState();
  const api = useContextApi();

  useEffect(() => {
    if (!api) return;

    (blockHash ? api.at(blockHash) : Promise.resolve(api))
      .then((blockApi) => {
        return blockApi.query[pallet]?.prime?.();
      })
      .then((prime) => {
        if (!prime) return;

        if (isMounted()) {
          setPrime(prime.toJSON());
        }
      });
  }, [api, blockHash, pallet, isMounted]);

  return prime;
}

export function useConditionalContextPrime() {
  const [prime, setPrime] = useState();
  const pallet = useCollectivePallet();
  const isMounted = useMountedState();
  const api = useConditionalContextApi();

  useEffect(() => {
    if (!api) return;

    api.query[pallet]?.prime?.().then((prime) => {
      if (!prime) return;
      if (isMounted()) {
        setPrime(prime.toJSON());
      }
    });
  }, [api, pallet, isMounted]);

  return prime;
}
