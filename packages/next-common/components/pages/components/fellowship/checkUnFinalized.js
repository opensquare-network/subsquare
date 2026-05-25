import React from "react";
import { backendApi } from "next-common/services/nextApi";
import CheckUnFinalizedBase from "next-common/components/checkUnFinalizedBase";

export default function CheckUnFinalized({ id }) {
  return (
    <CheckUnFinalizedBase
      onChainDataFetcher={async (api, checkPallet) => {
        if (!checkPallet("FellowshipReferenda", "ReferendumInfoFor")) {
          return;
        }

        return api.query.FellowshipReferenda.ReferendumInfoFor.getValue(
          parseInt(id),
        );
      }}
      serverPostFetcher={() => backendApi.fetch(`fellowship/referenda/${id}`)}
    />
  );
}
