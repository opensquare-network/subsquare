import React, { useCallback } from "react";
import nextApi from "next-common/services/nextApi";
import CheckUnFinalizedBase from "next-common/components/checkUnFinalizedBase";

export default function CheckUnFinalized({ id }) {
  const findMotion = useCallback(
    async (api) => {
      if (id?.match(/^[0-9]+$/)) {
        // If id is a motion index
        const allMotions = await api.query.council.proposals();
        const allVoting = await api.query.council.voting.multi(allMotions);

        for (let i = 0; i < allVoting.length; i++) {
          const data = allVoting[i].toJSON();
          const { index: motionIndex } = data || {};
          if (motionIndex === parseInt(id)) {
            return await api.query.council.proposalOf(allMotions[i]);
          }
        }
      } else {
        // If id is a motion hash
        return await api.query.council.proposalOf(id);
      }
    },
    [id]
  );

  return (
    <CheckUnFinalizedBase
      onChainDataFetcher={findMotion}
      serverPostFetcher={() => nextApi.fetch(`motions/${id}`)}
    />
  );
}
