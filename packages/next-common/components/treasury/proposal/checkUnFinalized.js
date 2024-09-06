import React from "react";
import nextApi from "next-common/services/nextApi";
import CheckUnFinalizedBase from "next-common/components/checkUnFinalizedBase";
import { useTreasuryPallet } from "next-common/context/treasury";
import { kebabCase } from "lodash-es";

export default function CheckUnFinalized({ id }) {
  const pallet = useTreasuryPallet();

  return (
    <CheckUnFinalizedBase
      onChainDataFetcher={async (api) => api.query[pallet]?.proposals(id)}
      serverPostFetcher={() => nextApi.fetch(`${kebabCase(pallet)}/proposals/${id}`)}
    />
  );
}
