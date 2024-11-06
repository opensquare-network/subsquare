import { useAssetHubApi } from "next-common/context/assetHub";
import { useAsync } from "react-use";
import { useEffect, useState } from "react";

export default function useQueryAssetHubForeignAssets(
  address,
  paraChainId = 3369,
  parentId = 1,
) {
  const api = useAssetHubApi();
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { loading, value: account } = useAsync(async () => {
    if (!api) {
      return;
    }

    const result = await api?.query?.foreignAssets?.account(
      {
        parents: parentId,
        interior: {
          X1: {
            ParaChain: paraChainId,
          },
        },
      },
      address,
    );

    return result?.toJSON()?.balance || 0;
  }, [api, address, paraChainId, parentId]);

  useEffect(() => {
    if (loading) {
      return;
    }

    setBalance(account);
    setIsLoading(false);
  }, [loading, account]);

  return {
    balance,
    isLoading,
  };
}
