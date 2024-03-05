import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";

export default function useBlockApi(atBlockHeight) {
  const [blockApi, setBlockApi] = useState();
  const api = useContextApi();
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
