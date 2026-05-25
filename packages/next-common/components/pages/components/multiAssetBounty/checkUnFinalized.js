import React from "react";
import { backendApi } from "next-common/services/nextApi";
import CheckUnFinalizedBase from "next-common/components/checkUnFinalizedBase";

export default function CheckUnFinalized({ id }) {
  return (
    <CheckUnFinalizedBase
      onChainDataFetcher={async (api, checkPallet) => {
        if (!checkPallet("MultiAssetBounties", "Bounties")) {
          return;
        }

        return api.query.MultiAssetBounties.Bounties.getValue(parseInt(id));
      }}
      serverPostFetcher={() =>
        backendApi.fetch(`treasury/multi-asset-bounties/${id}`)
      }
    />
  );
}
