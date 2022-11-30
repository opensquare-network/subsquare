import { useEffect, useState } from "react";
import toApiCouncil from "../toApiCouncil";
import useIsMounted from "./useIsMounted";
import useApi from "./useApi";
import { useChain } from "../../context/chain";

export default function usePrime({ blockHash, type }) {
  const chain = useChain();
  const [prime, setPrime] = useState();
  const isMounted = useIsMounted();
  const api = useApi();

  useEffect(() => {
    if (!api) return;

    (blockHash ? api.at(blockHash) : Promise.resolve(api))
      .then((blockApi) => {
        return blockApi.query[toApiCouncil(chain, type)]?.prime?.();
      })
      .then((prime) => {
        if (!prime) return;

        if (isMounted.current) {
          setPrime(prime.toJSON());
        }
      });
  }, [api, blockHash, chain, type, isMounted]);

  return prime;
}
