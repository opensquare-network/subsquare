import { useEffect, useState } from "react";
import { useAssetHubApi } from "next-common/hooks/chain/useAssetHubApi";

export default function useQueryAllForeignAssetDetail() {
  const api = useAssetHubApi();
  const [allDetail, setAllDetail] = useState();

  useEffect(() => {
    if (!api || !api.query?.foreignAssets?.asset) {
      return;
    }

    api.query.foreignAssets.asset.entries().then((entries) => {
      const result = entries
        .map(([key, optionalStorage]) => {
          const assetLocation = key.args[0];
          const assetId = assetLocation?.hash?.toString();

          if (!assetId || !optionalStorage.isSome) {
            return null;
          }

          const detail = optionalStorage.unwrap();
          return {
            assetId,
            owner: detail.owner.toJSON(),
            issuer: detail.issuer.toJSON(),
            admin: detail.admin.toJSON(),
            freezer: detail.freezer.toJSON(),
            supply: detail.supply.toJSON(),
            accounts: detail.accounts.toNumber(),
            status: detail.status.toJSON(),
            isSufficient: detail.isSufficient.toJSON(),
            minBalance: detail.minBalance.toJSON(),
          };
        })
        .filter(Boolean);

      setAllDetail(result);
    });
  }, [api]);

  return allDetail;
}
