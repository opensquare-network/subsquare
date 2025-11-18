import { useAsync } from "react-use";
import dayjs from "dayjs";
import { backendApi } from "next-common/services/nextApi";
import normalizeTreasuryProposalListItem from "next-common/utils/viewfuncs/treasury/normalizeProposalListItem";
import { useChain } from "next-common/context/chain";

export default function useProposals(proposalIndexes = []) {
  const chain = useChain();
  const { value: proposals = [], loading } = useAsync(async () => {
    const results = await Promise.allSettled(
      proposalIndexes.map(async (proposalIndex) => {
        const { result } = await backendApi.fetch(
          `/treasury/proposals/${proposalIndex}`,
        );
        return result;
      }),
    );
    return results
      .map((result) =>
        result.status === "fulfilled"
          ? normalizeTreasuryProposalListItem(chain, result.value)
          : null,
      )
      .filter(Boolean)
      .sort(
        (a, b) => dayjs(b.updatedAt).valueOf() - dayjs(a.updatedAt).valueOf(),
      );
  }, [proposalIndexes, chain]);

  return { proposals, loading };
}
