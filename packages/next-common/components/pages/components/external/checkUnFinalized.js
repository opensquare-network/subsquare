import React, { useCallback } from "react";
import { backendApi } from "next-common/services/nextApi";
import CheckUnFinalizedBase from "next-common/components/checkUnFinalizedBase";

export default function CheckUnFinalized({ id }) {
  const getExternalProposal = useCallback(
    async (api) => {
      const external = await api.query.Democracy.NextExternal.getValue();
      if (!external) return;
      const [proposal] = external;
      const hash = proposal.value?.hash;
      if (!hash || hash !== id) return;
      return external;
    },
    [id],
  );

  return (
    <CheckUnFinalizedBase
      onChainDataFetcher={getExternalProposal}
      serverPostFetcher={() => backendApi.fetch(`democracy/externals/${id}`)}
    />
  );
}
