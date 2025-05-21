import { useEffect, useMemo, useState } from "react";
import { getChainApi, getChainApiAt } from "../getChainApi";
import getChainSettings from "../consts/settings";
import { getParaChain } from "next-common/components/assets/paraChainTeleportPopup/teleportFromRelayChainToParaChain";

export function useParachainApi(parachainId, blockHeightOrHash) {
  const [parachainsApi, setParachainsApi] = useState(null);
  const [api, setApi] = useState(null);
  const endpointsUrls = useMemo(
    () =>
      getChainSettings(getParaChain(parachainId))
        ?.endpoints?.map((item) => item.url)
        .filter(Boolean),
    [parachainId],
  );

  useEffect(() => {
    if (parachainId && endpointsUrls?.length) {
      getChainApi(endpointsUrls).then((api) => {
        setParachainsApi(api);
      });
    }
  }, [parachainId, endpointsUrls]);

  useEffect(() => {
    if (parachainsApi && blockHeightOrHash) {
      setApi(null);
      getChainApiAt(parachainsApi, blockHeightOrHash).then((api) => {
        setApi(api);
      });
    }
    if (parachainsApi && !blockHeightOrHash) {
      setApi(parachainsApi);
    }
  }, [parachainsApi, blockHeightOrHash]);

  useEffect(() => {
    return () => {
      if (parachainsApi) {
        parachainsApi.disconnect();
      }
    };
  }, [parachainsApi]);

  return api;
}
