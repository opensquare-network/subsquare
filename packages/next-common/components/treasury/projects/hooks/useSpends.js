import { useAsync } from "react-use";
import { backendApi } from "next-common/services/nextApi";
import normalizeTreasurySpendListItem from "next-common/utils/viewfuncs/treasury/normalizeTreasurySpendListItem";
import { useChain } from "next-common/context/chain";

export default function useSpends(spendIndexes = []) {
  const chain = useChain();
  const { value: spends = [], loading } = useAsync(async () => {
    const results = await Promise.allSettled(
      spendIndexes.map(async (spendIndex) => {
        const { result } = await backendApi.fetch(
          `/treasury/spends/${spendIndex}`,
        );
        return result;
      }),
    );
    return results
      .map((result) =>
        result.status === "fulfilled"
          ? normalizeTreasurySpendListItem(chain, result.value)
          : null,
      )
      .filter(Boolean);
  }, [spendIndexes, chain]);

  return { spends, loading };
}
