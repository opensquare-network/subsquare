import { useEffect, useState, useCallback } from "react";
import { useTreasuryPallet } from "next-common/context/treasury";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import { hasTreasuryApprovals } from "next-common/utils/treasury/approvals";

function hasLegacyProposalStorage(palletQuery) {
  return palletQuery?.approvals && palletQuery?.proposals;
}

export default function useToBeAwarded() {
  const api = useContextApi();
  const pallet = useTreasuryPallet();
  const hasApprovals = hasTreasuryApprovals(useChainSettings());
  const [toBeAwarded, setToBeAwarded] = useState();

  const palletQuery = api?.query?.[pallet];
  const fetchToBeAwarded = useCallback(async () => {
    // Chains on the AssetHub spend flow have no approvals, and when the
    // metadata no longer contains the storage, nothing can be pending award.
    if (!hasApprovals || !hasLegacyProposalStorage(palletQuery)) {
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
  }, [palletQuery, hasApprovals]);

  useEffect(() => {
    if (!api) {
      return;
    }

    fetchToBeAwarded();
  }, [api, fetchToBeAwarded]);

  return toBeAwarded;
}
