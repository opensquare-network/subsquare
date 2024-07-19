import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";

export default function useQueryAllAssetDetail() {
  const api = useContextApi();
  const [allDetail, setAllDetail] = useState();

  useEffect(() => {
    if (!api) {
      return;
    }

    api.query.assets.asset.entries().then((entries) => {
      const result = entries.map(([key, optionalStorage]) => {
        const detail = optionalStorage.unwrap();
        return {
          assetId: key.args[0].toNumber(),
          owner: detail.owner.toJSON(),
          issuer: detail.issuer.toJSON(),
          admin: detail.admin.toJSON(),
          freezer: detail.freezer.toJSON(),
          supply: detail.supply.toJSON(),
          accounts: detail.accounts.toNumber(),
          status: detail.status.toJSON(),
        };
      });
      setAllDetail(result);
    });
  }, [api]);

  return allDetail;
}
