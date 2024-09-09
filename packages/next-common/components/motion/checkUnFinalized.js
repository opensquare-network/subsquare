import React, { useCallback } from "react";
import nextApi from "next-common/services/nextApi";
import CheckUnFinalizedBase from "next-common/components/checkUnFinalizedBase";
import { useDetailType } from "next-common/context/page";
import { toApiType } from "next-common/utils/viewfuncs";
import { useCollectivePallet } from "next-common/context/collective";

export default function CheckUnFinalized({ id }) {
  const type = useDetailType();
  const pallet = useCollectivePallet();

  const findMotion = useCallback(
    async (api) => {
      const councilApi = api.query[pallet];
      if (!councilApi) {
        return;
      }

      if (id?.match(/^[0-9]+$/)) {
        // If id is a motion index
        const allMotions = await councilApi.proposals();
        const allVoting = await councilApi.voting.multi(allMotions);

        for (let i = 0; i < allVoting.length; i++) {
          const data = allVoting[i].toJSON();
          const { index: motionIndex } = data || {};
          if (motionIndex === parseInt(id)) {
            return await councilApi.proposalOf(allMotions[i]);
          }
        }
      } else {
        // If id is a motion hash
        return await councilApi.proposalOf(id);
      }
    },
    [id, pallet],
  );

  return (
    <CheckUnFinalizedBase
      onChainDataFetcher={findMotion}
      serverPostFetcher={() => nextApi.fetch(`${toApiType(type)}/${id}`)}
    />
  );
}
