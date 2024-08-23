import { useAsync } from "react-use";
import nextApi from "next-common/services/nextApi";
import Chains from "next-common/utils/consts/chains";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useChain } from "next-common/context/chain";

const STATESCAN_CHAIN_URL_MAP = {
  "polkadot-assethub": "https://statemint-api.statescan.io",
};

function getTransfersHistoryURL(address, chain) {
  const urlSuffix = `/accounts/${address}/transfers`;
  if (Chains.polkadotAssetHub === chain) {
    return `${STATESCAN_CHAIN_URL_MAP[chain]}${urlSuffix}`;
  }

  throw new Error(`Chain ${chain} is not supported.`);
}

export default function useTransfersHistory(page = 0, page_size = 25) {
  const address = useRealAddress();
  const chain = useChain();
  const { value: value, loading } = useAsync(async () => {
    const url = getTransfersHistoryURL(address, chain);
    if (!url) {
      return {};
    }

    try {
      const response = await nextApi.fetch(url, {
        page,
        page_size,
      });
      return response?.result || {};
    } catch (error) {
      return {};
    }
  }, [page, page_size]);

  return { value, loading };
}
