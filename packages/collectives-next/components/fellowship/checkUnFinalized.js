import React from "react";
import nextApi from "next-common/services/nextApi";
import CheckUnFinalizedBase from "next-common/components/checkUnFinalizedBase";

export default function CheckUnFinalized({ id }) {
  return (
    <CheckUnFinalizedBase
      onChainDataFetcher={async (api) =>
        api.query.fellowshipReferenda?.referendumInfoFor(id)
      }
      serverPostFetcher={() => nextApi.fetch(`fellowship/referenda/${id}`)}
    />
  );
}
