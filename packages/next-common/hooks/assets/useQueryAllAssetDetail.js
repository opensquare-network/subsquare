import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";

export default function useQueryAllAssetDetail() {
  const api = useContextApi();
  const [allDetail, setAllDetail] = useState();

  useEffect(() => {
    if (!api) {
      return;
    }

    api.query.assets.asset.entries().then((data) => {
      const result = data.map((item) => {
        const [
          {
            args: [id],
          },
          data,
        ] = item;
        const assetId = id.toNumber();
        const detail = data.unwrap();
        return {
          assetId,
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
