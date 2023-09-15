import React, { useCallback } from "react";
import nextApi from "next-common/services/nextApi";
import CheckUnFinalizedBase from "next-common/components/checkUnFinalizedBase";

export default function CheckUnFinalized({ id }) {
  const getPublicProposal = useCallback(
    async (api) => {
      const proposals = await api.query.democracy?.publicProps();
      if (!proposals || proposals.isNone) {
        return;
      }
      return proposals.find(([index]) => index.toNumber() === parseInt(id));
    },
    [id],
  );

  return (
    <CheckUnFinalizedBase
      onChainDataFetcher={getPublicProposal}
      serverPostFetcher={() => nextApi.fetch(`democracy/proposals/${id}`)}
    />
  );
}
