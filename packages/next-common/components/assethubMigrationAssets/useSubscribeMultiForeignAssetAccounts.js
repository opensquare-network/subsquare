import { useContextApi } from "next-common/context/api";
import { useMemo } from "react";
import useSubscribeMultiAccounts from "next-common/utils/hooks/useSubscribeMultiAccounts";

export default function useSubscribeMultiForeignAssetAccounts(
  metadata,
  address,
) {
  const api = useContextApi();
  const query = api?.query?.foreignAssets?.account;

  const keys = useMemo(() => {
    if (!metadata || !address) {
      return null;
    }

    return metadata.map((asset) => [asset.storageLocation, address]);
  }, [address, metadata]);

  return useSubscribeMultiAccounts(query, keys);
}
