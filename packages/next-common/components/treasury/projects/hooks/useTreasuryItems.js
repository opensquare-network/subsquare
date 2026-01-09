import { useAsync } from "react-use";
import dayjs from "dayjs";
import { fetchTreasuryItemData } from "next-common/services/treasuryItemsData";
import { useChain } from "next-common/context/chain";

export default function useTreasuryItems({
  indexes = [],
  apiPath,
  normalizeItem,
}) {
  const chain = useChain();
  const { value: items = [], loading } = useAsync(async () => {
    if (!indexes?.length) {
      return [];
    }

    const results = await Promise.allSettled(
      indexes.map(async (index) => {
        return await fetchTreasuryItemData(apiPath, index);
      }),
    );

    return results
      .map((result) =>
        result.status === "fulfilled"
          ? normalizeItem(chain, result.value)
          : null,
      )
      .filter(Boolean)
      .sort(
        (a, b) => dayjs(b.updatedAt).valueOf() - dayjs(a.updatedAt).valueOf(),
      );
  }, [indexes, apiPath, normalizeItem, chain]);

  return { items, loading };
}
