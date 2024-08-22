import { useAsync } from "react-use";
import nextApi from "next-common/services/nextApi";
import { STATESCAN_CHAIN_URL_MAP } from "next-common/utils/constants";
import Chains from "next-common/utils/consts/chains";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useChain } from "next-common/context/chain";

function getTransfersHistoryURL(address, chain) {
  const urlSuffix = `/accounts/${address}/transfers`;
  if (Chains.polkadotAssetHub === chain) {
    return `${STATESCAN_CHAIN_URL_MAP[chain]}${urlSuffix}`;
  }

  throw new Error("Invalid chain.");
}

export default function useTransfersHistory(page = 0, page_size = 25) {
  const address = useRealAddress();
  const chain = useChain();
  const { value: value, loading } = useAsync(async () => {
    const url = getTransfersHistoryURL(address, chain);

    const response = await nextApi.fetch(url, {
      page,
      page_size,
    });

    return response?.result;
  }, [page, page_size]);

  return { value, loading };
}
