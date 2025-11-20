import { usePeopleApi, getPeopleChain } from "next-common/context/people/api";
import {
  useCoretimeApi,
  getCoretimeChain,
} from "next-common/context/coretime/api";
import { useRelayChainLatestHeight } from "next-common/hooks/relayScanHeight";
import useChainOrScanHeight from "next-common/hooks/height";
import { useState, useEffect, useMemo } from "react";
import { useChain } from "next-common/context/chain";
import { useChainSettings } from "next-common/context/chain";
import { useAssetHubChain } from "next-common/hooks/useAssetHubChain";
import { useSubScanHeightStream } from "next-common/hooks/scanHeight/useSubScanHeightStream";
import getChainSettings from "next-common/utils/consts/settings";

function useSubscribeChainBlockHeight(api) {
  const [latestHeight, setLatestHeight] = useState(null);

  useEffect(() => {
    if (!api) {
      return;
    }

    let unsubscribe;
    let isMounted = true;

    api.rpc.chain
      .subscribeNewHeads((header) => {
        if (isMounted) {
          const latestUnFinalizedHeight = header.number.toNumber();
          setLatestHeight(latestUnFinalizedHeight);
        }
      })
      .then((unsub) => {
        if (isMounted) {
          unsubscribe = unsub;
        } else {
          unsub();
        }
      })
      .catch((error) => {
        console.error("Failed to subscribe to new heads:", error);
      });

    return () => {
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [api]);

  return latestHeight;
}

export function usePeopleBlockHeight() {
  const peopleApi = usePeopleApi();
  return useSubscribeChainBlockHeight(peopleApi);
}

export function useCoretimeBlockHeight() {
  const chain = useChain();
  const coretimeChain = getCoretimeChain(chain);
  const { blockTime } = getChainSettings(coretimeChain);
  const [coretimeScanHeight, setCoretimeScanHeight] = useState(null);
  const interval = parseInt(blockTime) || 12000;

  useSubScanHeightStream({
    url: `stream/coretime-chain-height?interval=${interval}`,
    timeout: 10 * interval,
    callback: setCoretimeScanHeight,
  });

  return coretimeScanHeight;
}

export default function useSystemChainsBlockHeight() {
  const relayBlockHeight = useRelayChainLatestHeight();
  const assetHubBlockHeight = useChainOrScanHeight();
  const peopleBlockHeight = usePeopleBlockHeight();
  const coretimeBlockHeight = useCoretimeBlockHeight();
  const chain = useChain();
  const { modules } = useChainSettings();
  const assetHubChain = useAssetHubChain();

  return useMemo(() => {
    const chains = [
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
      chains.push({
        network: "Coretime",
        chain: getCoretimeChain(chain),
        height: coretimeBlockHeight,
      });
    }

    return chains;
  }, [
    chain,
    relayBlockHeight,
    assetHubChain,
    assetHubBlockHeight,
    peopleBlockHeight,
    coretimeBlockHeight,
    modules?.coretime,
  ]);
}
