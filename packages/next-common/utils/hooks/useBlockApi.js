import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";

export default function useBlockApi(atBlockHeightOrHash) {
  const [blockApi, setBlockApi] = useState();
  const api = useContextApi();
  useEffect(() => {
    if (!api) {
      return;
    }

    if (!atBlockHeightOrHash) {
      setBlockApi(api);
      return;
    }

    if (/^\d+$/.test(atBlockHeightOrHash)) {
      api.rpc.chain
        .getBlockHash(atBlockHeightOrHash)
        .then((blockHash) => api.at(blockHash))
        .then((blockApi) => setBlockApi(blockApi));
    } else {
      api.at(atBlockHeightOrHash).then(blockApi => setBlockApi(blockApi));
    }
  }, [api, atBlockHeightOrHash]);

  return blockApi;
}
