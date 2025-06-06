import { useEffect, useState } from "react";
import { useMountedState } from "react-use";
import { useContextApi } from "next-common/context/api";
import { useCollectivePallet } from "next-common/context/collective";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";

function usePrimeFromApi(api) {
  const [prime, setPrime] = useState();
  const pallet = useCollectivePallet();
  const isMounted = useMountedState();

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

export default function usePrime() {
  const api = useContextApi();
  return usePrimeFromApi(api);
}

export function useConditionalContextPrime() {
  const api = useConditionalContextApi();
  return usePrimeFromApi(api);
}
