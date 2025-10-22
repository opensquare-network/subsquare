import React from "react";
import { backendApi } from "next-common/services/nextApi";
import CheckUnFinalizedBase from "next-common/components/checkUnFinalizedBase";

export default function CheckUnFinalized({ id, hasSidebar }) {
  return (
    <CheckUnFinalizedBase
      hasSidebar={hasSidebar}
      onChainDataFetcher={async (api) =>
        api.query.referenda?.referendumInfoFor(id)
      }
      serverPostFetcher={() => backendApi.fetch(`gov2/referendums/${id}`)}
    />
  );
}
