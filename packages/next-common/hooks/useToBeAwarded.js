import { useEffect, useState, useCallback } from "react";
import { useContextApi } from "next-common/context/api";
import { useProposalsSection } from "next-common/context/treasury/proposals";

function isValidApi(api) {
  return api?.approvals && api?.proposals;
}

function useToBeAwardedAPI(api) {
  const [toBeAwarded, setToBeAwarded] = useState();

  const fetchToBeAwarded = useCallback(async () => {
    if (!isValidApi(api)) return;

    try {
      const [approvals, proposals] = await Promise.all([
        api.approvals(),
        api.proposals.entries(),
      ]);

      const toBeAwardedProposalIds = approvals.toJSON();
      const toBeAwarded = proposals.reduce((total, [id, proposal]) => {
        if (proposal.isNone) return total;

        const proposalId = id.args[0].toNumber();
        if (!toBeAwardedProposalIds.includes(proposalId)) return total;

        return total + proposal.value.value.toBigInt();
      }, 0n);

      setToBeAwarded(toBeAwarded);
    } catch (error) {
      console.error("Error fetching to be awarded proposals:", error);
    }
  }, [api]);

  useEffect(() => {
    fetchToBeAwarded();
  }, [fetchToBeAwarded]);

  return toBeAwarded;
}

export default function useToBeAwarded() {
  const api = useContextApi();
  const section = useProposalsSection();

  const toBeAwardedAPI =
    section === "communityTreasury"
      ? api?.query?.communityTreasury
      : api?.query?.treasury;

  return useToBeAwardedAPI(toBeAwardedAPI);
}
