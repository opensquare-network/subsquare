import React from "react";
import { backendApi } from "next-common/services/nextApi";
import CheckUnFinalizedBase from "next-common/components/checkUnFinalizedBase";

export default function CheckUnFinalized({ id }) {
  const [parentBountyId, index] = id.split("_");

  return (
    <CheckUnFinalizedBase
      onChainDataFetcher={async (api, checkPallet) => {
        if (!checkPallet("MultiAssetBounties", "ChildBounties")) {
          return;
        }

        return api.query.MultiAssetBounties.ChildBounties.getValue(
          parseInt(parentBountyId),
          parseInt(index),
        );
      }}
      serverPostFetcher={() =>
        backendApi.fetch(`treasury/multi-asset-child-bounties/${id}`)
      }
    />
  );
}
