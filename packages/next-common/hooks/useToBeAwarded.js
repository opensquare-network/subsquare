import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";
import { useProposalsSection } from "next-common/context/treasury/proposals";

function useToBeAwardedAPI(api) {
  const [toBeAwarded, setToBeAwarded] = useState();

  useEffect(() => {
    if (!api || !api.approvals || !api.proposals) {
      return;
    }

    Promise.all([api.approvals(), api.proposals.entries()]).then(
      ([approvals, proposals]) => {
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
      },
    );
  }, [api]);

  return toBeAwarded;
}

export default function useToBeAwarded() {
  const api = useContextApi();
  const section = useProposalsSection();

  const isCommunityTreasuryPage = section === "community-treasury";
  const toBeAwardedAPI = isCommunityTreasuryPage
    ? api?.query?.communityTreasury
    : api?.query?.treasury;
  const toBeAwarded = useToBeAwardedAPI(toBeAwardedAPI);

  return toBeAwarded;
}
