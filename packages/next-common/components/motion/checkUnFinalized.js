import React, { useCallback } from "react";
import { backendApi } from "next-common/services/nextApi";
import CheckUnFinalizedBase from "next-common/components/checkUnFinalizedBase";
import { useDetailType } from "next-common/context/page";
import { toApiType } from "next-common/utils/viewfuncs";
import { useCollectivePallet } from "next-common/context/collective";
import { upperFirst } from "lodash-es";

export default function CheckUnFinalized({ id }) {
  const type = useDetailType();
  const pallet = useCollectivePallet();

  const findMotion = useCallback(
    async (api) => {
      const papiPallet = upperFirst(pallet);
      const palletApi = api.query[papiPallet];
      if (!palletApi) {
        return;
      }

      if (id?.match(/^[0-9]+$/)) {
        // If id is a motion index
        const allMotions = await palletApi.Proposals.getValue();
        if (!allMotions) return;
        const allVotingEntries = await palletApi.Voting.getEntries();
        for (const {
          keyArgs: [hash],
          value: voting,
        } of allVotingEntries) {
          if (
            voting &&
            voting.index === parseInt(id) &&
            allMotions.some((h) => h === hash)
          ) {
            return await palletApi.ProposalOf.getValue(hash);
          }
        }
      } else {
        // If id is a motion hash
        return await palletApi.ProposalOf.getValue(id);
      }
    },
    [id, pallet],
  );

  return (
    <CheckUnFinalizedBase
      onChainDataFetcher={findMotion}
      serverPostFetcher={() => backendApi.fetch(`${toApiType(type)}/${id}`)}
    />
  );
}
