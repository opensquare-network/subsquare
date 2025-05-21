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
        if (!blockHeightOrHash) {
          setApi(api);
        }
      });
    }
  }, [parachainId, endpointsUrls, blockHeightOrHash]);

  useEffect(() => {
    if (parachainsApi && blockHeightOrHash) {
      getChainApiAt(parachainsApi, blockHeightOrHash).then((api) => {
        setApi(api);
      });
    }
  }, [parachainsApi, blockHeightOrHash]);

  useEffect(() => {
    return () => {
      parachainsApi?.disconnect();
    };
  }, [parachainsApi]);

  return api;
}
