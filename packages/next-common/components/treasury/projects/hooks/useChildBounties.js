import { useAsync } from "react-use";
import dayjs from "dayjs";
import { backendApi } from "next-common/services/nextApi";
import normalizeChildBountyListItem from "next-common/utils/viewfuncs/treasury/normalizeChildBountyListItem";
import { useChain } from "next-common/context/chain";

export default function useChildBounties(childBountyIndexes = []) {
  const chain = useChain();
  const { value: childBounties = [], loading } = useAsync(async () => {
    const results = await Promise.allSettled(
      childBountyIndexes.map(async (childBountyIndex) => {
        const { result } = await backendApi.fetch(
          `/treasury/child-bounties/${childBountyIndex}`,
        );
        return result;
      }),
    );
    return results
      .map((result) =>
        result.status === "fulfilled"
          ? normalizeChildBountyListItem(chain, result.value)
          : null,
      )
      .filter(Boolean)
      .sort(
        (a, b) => dayjs(b.updatedAt).valueOf() - dayjs(a.updatedAt).valueOf(),
      );
  }, [childBountyIndexes, chain]);

  return { childBounties, loading };
}
