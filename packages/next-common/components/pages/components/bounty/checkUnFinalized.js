import React from "react";
import { backendApi } from "next-common/services/nextApi";
import CheckUnFinalizedBase from "next-common/components/checkUnFinalizedBase";

export default function CheckUnFinalized({ id }) {
  return (
    <CheckUnFinalizedBase
      onChainDataFetcher={async (api, checkPallet) => {
        if (!checkPallet("Bounties", "Bounties")) {
          return;
        }

        return api.query.Bounties.Bounties.getValue(parseInt(id));
      }}
      serverPostFetcher={() => backendApi.fetch(`treasury/bounties/${id}`)}
    />
  );
}
