import { useAssetHubApi } from "next-common/context/assetHub";
import { useAsync } from "react-use";
import { useEffect, useState } from "react";

export default function useQueryMythTokenBalance(address) {
  const api = useAssetHubApi();
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { loading, value } = useAsync(async () => {
    if (!api) {
      return;
    }

    const result = await api?.query?.foreignAssets?.account(
      {
        parents: 1,
        interior: {
          X1: [
            {
              Parachain: 3369,
            },
          ],
        },
      },
      address,
    );

    return result?.toJSON()?.balance || 0;
  }, [api, address, paraChainId, parentId]);

  useEffect(() => {
    if (loading || !value) {
      return;
    }

    setBalance(value);
    setIsLoading(false);
  }, [loading, value]);

  return {
    balance,
    isLoading,
  };
}
