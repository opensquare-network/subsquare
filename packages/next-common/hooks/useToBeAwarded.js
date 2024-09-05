import { useEffect, useState, useCallback } from "react";
import { useContextApi } from "next-common/context/api";
import { useTreasuryPallet } from "next-common/context/treasury";

function isValidApi(api) {
  return api?.approvals && api?.proposals;
}

export default function useToBeAwarded() {
  const api = useContextApi();
  const pallet = useTreasuryPallet();
  const [toBeAwarded, setToBeAwarded] = useState();

  const toBeAwardedAPI = api?.query?.[pallet];

  const fetchToBeAwarded = useCallback(async () => {
    if (!isValidApi(toBeAwardedAPI)) return;

    try {
      const [approvals, proposals] = await Promise.all([
        toBeAwardedAPI.approvals(),
        toBeAwardedAPI.proposals.entries(),
      ]);

      const toBeAwardedProposalIds = approvals.toJSON();
      const toBeAwardedAmount = proposals.reduce((total, [id, proposal]) => {
        if (proposal.isNone) return total;

        const proposalId = id.args[0].toNumber();
        if (!toBeAwardedProposalIds.includes(proposalId)) return total;

        return total + proposal.value.value.toBigInt();
      }, 0n);

      setToBeAwarded(toBeAwardedAmount);
    } catch (error) {
      console.error("Error fetching to be awarded proposals:", error);
    }
  }, [toBeAwardedAPI]);

  useEffect(() => {
    if (toBeAwardedAPI) {
      fetchToBeAwarded();
    }
  }, [fetchToBeAwarded, toBeAwardedAPI]);

  return toBeAwarded;
}
