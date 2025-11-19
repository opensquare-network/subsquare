import { usePeopleApi, getPeopleChain } from "next-common/context/people/api";
import {
  useCoretimeApi,
  getCoretimeChain,
} from "next-common/context/coretime/api";
import { useRelayChainLatestHeight } from "next-common/hooks/relayScanHeight";
import useChainOrScanHeight from "next-common/hooks/height";
import { useMountedState } from "react-use";
import { useState, useEffect } from "react";
import { useChain } from "next-common/context/chain";
import { useChainSettings } from "next-common/context/chain";
import { useAssetHubChain } from "next-common/hooks/useAssetHubChain";

function useSubscribeChainBlockHeight(api) {
  const isMounted = useMountedState();
  const [latestHeight, setLatestHeight] = useState(null);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.rpc.chain.subscribeNewHeads((header) => {
      const latestUnFinalizedHeight = header.number.toNumber();
      if (isMounted()) {
        setLatestHeight(latestUnFinalizedHeight);
      }
    });
  }, [api, isMounted]);

  return latestHeight;
}

export function usePeopleBlockHeight() {
  const peopleApi = usePeopleApi();
  return useSubscribeChainBlockHeight(peopleApi);
}

// TODO: fetch height from backend api.
export function useCoretimeBlockHeight() {
  const coretimeApi = useCoretimeApi();
  return useSubscribeChainBlockHeight(coretimeApi);
}

export default function useSystemChainsBlockHeight() {
  const relayBlockHeight = useRelayChainLatestHeight();
  const assetHubBlockHeight = useChainOrScanHeight();
  const peopleBlockHeight = usePeopleBlockHeight();
  const coretimeBlockHeight = useCoretimeBlockHeight();
  const chain = useChain();
  const { modules } = useChainSettings();
  const assetHubChain = useAssetHubChain();

  let result = [
    {
      network: "Relay Chain",
      chain,
      height: relayBlockHeight,
    },
    {
      network: "Asset Hub",
      chain: assetHubChain,
      height: assetHubBlockHeight,
    },
    {
      network: "People",
      chain: getPeopleChain(chain),
      height: peopleBlockHeight,
    },
  ];

  if (modules?.coretime) {
    result.push({
      network: "Coretime",
      chain: getCoretimeChain(chain),
      height: coretimeBlockHeight,
    });
  }

  return result;
}
