import { useEffect, useState } from "react";
import useApi from "./useApi";

export default function useBlockApi(atBlockHeight) {
  const [blockApi, setBlockApi] = useState();
  const api = useApi();
  useEffect(() => {
    if (!api) {
      return;
    }

    if (!atBlockHeight) {
      setBlockApi(api);
      return;
    }

    api.rpc.chain
      .getBlockHash(atBlockHeight)
      .then((blockHash) => api.at(blockHash))
      .then((blockApi) => setBlockApi(blockApi));
  }, [api, atBlockHeight]);

  return blockApi;
}
