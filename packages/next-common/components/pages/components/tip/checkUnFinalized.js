import React from "react";
import { backendApi } from "next-common/services/nextApi";
import CheckUnFinalizedBase from "next-common/components/checkUnFinalizedBase";

export default function CheckUnFinalized({ id }) {
  return (
    <CheckUnFinalizedBase
      onChainDataFetcher={async (api, checkPallet) => {
        if (!checkPallet("Tips", "Tips")) {
          return;
        }

        return api.query.Tips.Tips.getValue(id);
      }}
      serverPostFetcher={() => backendApi.fetch(`treasury/tips/${id}`)}
    />
  );
}
