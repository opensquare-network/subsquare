import React from "react";
import { backendApi } from "next-common/services/nextApi";
import CheckUnFinalizedBase from "next-common/components/checkUnFinalizedBase";

export default function CheckUnFinalized({ id }) {
  return (
    <CheckUnFinalizedBase
      onChainDataFetcher={async (api) =>
        api.query.Democracy.ReferendumInfoOf.getValue(parseInt(id))
      }
      serverPostFetcher={() => backendApi.fetch(`democracy/referendums/${id}`)}
    />
  );
}
