import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";

export default function useToBeAwarded() {
  const api = useContextApi();
  const [toBeAwarded, setToBeAwarded] = useState();

  useEffect(() => {
    if (
      !api ||
      !api?.query?.treasury?.approvals ||
      !api?.query?.treasury?.proposals
    ) {
      return;
    }

    Promise.all([
      api.query.treasury.approvals(),
      api.query.treasury.proposals.entries(),
    ]).then(([approvals, proposals]) => {
      const toBeAwardedProposalIds = approvals.toJSON();
      const toBeAwarded = proposals.reduce((result, [id, proposal]) => {
        if (proposal.isNone) {
          return result;
        }
        const proposalId = id.args[0].toNumber();
        if (!toBeAwardedProposalIds.includes(proposalId)) {
          return result;
        }
        return result + proposal.value.value.toBigInt();
      }, 0n);
      setToBeAwarded(toBeAwarded);
    });
  }, [api]);

  return toBeAwarded;
}
