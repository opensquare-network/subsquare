import { useEffect, useState, useCallback } from "react";
import { useTreasuryPapiPallet } from "next-common/context/treasury";
import { useContextPapi } from "next-common/context/papi";
import { useChainSettings } from "next-common/context/chain";
import { hasTreasuryApprovals } from "next-common/utils/treasury/approvals";

export default function useToBeAwardedWithPapi() {
  const { api: papi, checkPallet } = useContextPapi();
  const pallet = useTreasuryPapiPallet();
  const hasApprovals = hasTreasuryApprovals(useChainSettings());
  const [toBeAwarded, setToBeAwarded] = useState();

  const fetchToBeAwarded = useCallback(async () => {
    if (!papi || !pallet) {
      return;
    }

    // Chains on the AssetHub spend flow have no approvals, and when the legacy
    // storage is gone nothing can be pending award anymore.
    if (
      !hasApprovals ||
      !checkPallet(pallet, "Approvals") ||
      !checkPallet(pallet, "Proposals")
    ) {
      setToBeAwarded(0n);
      return;
    }

    try {
      const [approvals, proposals] = await Promise.all([
        papi.query[pallet].Approvals.getValue(),
        papi.query[pallet].Proposals.getEntries(),
      ]);

      const toBeAwardedProposalIds = approvals || [];
      const toBeAwardedAmount = proposals.reduce(
        (total, { keyArgs, value }) => {
          if (!value) {
            return total;
          }

          const [proposalId] = keyArgs || [];
          if (!toBeAwardedProposalIds.includes(proposalId)) {
            return total;
          }

          return total + BigInt(value.value ?? 0);
        },
        0n,
      );

      setToBeAwarded(toBeAwardedAmount);
    } catch (error) {
      console.error("Error fetching to be awarded proposals with papi:", error);
    }
  }, [checkPallet, papi, pallet, hasApprovals]);

  useEffect(() => {
    if (papi && pallet) {
      fetchToBeAwarded();
    }
  }, [fetchToBeAwarded, papi, pallet]);

  return toBeAwarded;
}
