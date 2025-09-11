import React, { useCallback } from "react";
import { backendApi } from "next-common/services/nextApi";
import CheckUnFinalizedBase from "next-common/components/checkUnFinalizedBase";

export default function CheckUnFinalized({ id }) {
  const getExternalProposal = useCallback(
    async (api) => {
      const externals = await api.query.democracy?.nextExternal();
      const data = externals?.toJSON();
      const [{ lookup: { hash } = {} } = {}] = data || [];
      if (hash !== id) {
        return;
      }
      return externals;
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
