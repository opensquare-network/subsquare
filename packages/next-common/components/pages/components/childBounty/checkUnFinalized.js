import React from "react";
import { backendApi } from "next-common/services/nextApi";
import CheckUnFinalizedBase from "next-common/components/checkUnFinalizedBase";

export default function CheckUnFinalized({ id }) {
  const [parentBountyId, index] = id.split("_");
  return (
    <CheckUnFinalizedBase
      onChainDataFetcher={async (api) =>
        api.query.childBounties?.childBounties(parentBountyId, index)
      }
      serverPostFetcher={() =>
        backendApi.fetch(`treasury/child-bounties/${id}`)
      }
    />
  );
}
