import React from "react";
import { backendApi } from "next-common/services/nextApi";
import CheckUnFinalizedBase from "next-common/components/checkUnFinalizedBase";
import { useTreasuryPapiPallet } from "next-common/context/treasury";
import { kebabCase } from "lodash-es";

export default function CheckUnFinalized({ id }) {
  const pallet = useTreasuryPapiPallet();

  return (
    <CheckUnFinalizedBase
      onChainDataFetcher={async (api, checkPallet) => {
        if (!checkPallet(pallet, "Proposals")) {
          return;
        }

        return api.query[pallet].Proposals.getValue(parseInt(id));
      }}
      serverPostFetcher={() =>
        backendApi.fetch(`${kebabCase(pallet)}/proposals/${id}`)
      }
    />
  );
}
