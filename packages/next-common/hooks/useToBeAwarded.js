import { useEffect, useState, useCallback } from "react";
import { useTreasuryPallet } from "next-common/context/treasury";
import { useContextApi } from "next-common/context/api";

function hasLegacyProposalStorage(palletQuery) {
  return palletQuery?.approvals && palletQuery?.proposals;
}

export default function useToBeAwarded() {
  const api = useContextApi();
  const pallet = useTreasuryPallet();
  const [toBeAwarded, setToBeAwarded] = useState();

  const palletQuery = api?.query?.[pallet];
  const fetchToBeAwarded = useCallback(async () => {
    // `Proposals`/`Approvals` were removed from the treasury pallet, so when the
    // metadata no longer contains them, nothing can be pending award.
    if (!hasLegacyProposalStorage(palletQuery)) {
      setToBeAwarded(0n);
      return;
    }

    try {
      const [approvals, proposals] = await Promise.all([
        palletQuery.approvals(),
        palletQuery.proposals.entries(),
      ]);

      const toBeAwardedProposalIds = approvals.toJSON();
      const toBeAwardedAmount = proposals.reduce((total, [id, proposal]) => {
        if (proposal.isNone) {
          return total;
        }

        const proposalId = id.args[0].toNumber();
        if (!toBeAwardedProposalIds.includes(proposalId)) {
          return total;
        }

        return total + proposal.value.value.toBigInt();
      }, 0n);

      setToBeAwarded(toBeAwardedAmount);
    } catch (error) {
      console.error("Error fetching to be awarded proposals:", error);
    }
  }, [palletQuery]);

  useEffect(() => {
    if (!api) {
      return;
    }

    fetchToBeAwarded();
  }, [api, fetchToBeAwarded]);

  return toBeAwarded;
}
