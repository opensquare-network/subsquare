import React from "react";
import nextApi from "next-common/services/nextApi";
import CheckUnFinalizedBase from "next-common/components/checkUnFinalizedBase";

export default function CheckUnFinalized({ id, pallet = "treasury" }) {
  return (
    <CheckUnFinalizedBase
      onChainDataFetcher={async (api) => api.query[pallet]?.proposals(id)}
      serverPostFetcher={() => nextApi.fetch(`treasury/proposals/${id}`)}
    />
  );
}
