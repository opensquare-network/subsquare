import { useEffect, useState, useCallback } from "react";
import { useTreasuryPapiPallet } from "next-common/context/treasury";
import { useContextPapi } from "next-common/context/papi";

export default function useToBeAwardedWithPapi() {
  const { api: papi, checkPallet } = useContextPapi();
  const pallet = useTreasuryPapiPallet();
  const [toBeAwarded, setToBeAwarded] = useState();

  const fetchToBeAwarded = useCallback(async () => {
    if (
      !checkPallet(pallet, "Approvals") ||
      !checkPallet(pallet, "Proposals")
    ) {
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
  }, [checkPallet, papi, pallet]);

  useEffect(() => {
    if (papi && pallet) {
      fetchToBeAwarded();
    }
  }, [fetchToBeAwarded, papi, pallet]);

  return toBeAwarded;
}
