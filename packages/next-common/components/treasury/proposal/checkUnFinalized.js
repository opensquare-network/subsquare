import React from "react";
import nextApi from "next-common/services/nextApi";
import CheckUnFinalizedBase from "next-common/components/checkUnFinalizedBase";

export default function CheckUnFinalized({ id }) {
  return (
    <CheckUnFinalizedBase
      onChainDataFetcher={(api) => api.query.treasury.proposals(id)}
      serverPostFetcher={() => nextApi.fetch(`treasury/proposals/${id}`)}
    />
  );
}
