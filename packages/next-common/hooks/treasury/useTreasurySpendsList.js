import { useRouter } from "next/router";
import nextApi from "next-common/services/nextApi";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { upperFirst } from "lodash-es";
import { usePendingSpendsFromContext } from "next-common/components/treasury/spends/pendingContext";
import { useEffect, useState } from "react";

export default function useTreasurySpendsList() {
  const router = useRouter();
  const { claimable = [], loading: pendingSpendsLoading } =
    usePendingSpendsFromContext();
  const {
    page,
    page_size: pageSize,
    status,
    valid_only: validOnlyQuery,
  } = router.query;
  const validOnly = validOnlyQuery === "true" || validOnlyQuery === true;
  const claimableIds = validOnly ? claimable.join(",") : "";
  const shouldWaitPendingSpends = validOnly && pendingSpendsLoading;
  const [spends, setSpends] = useState(EmptyList);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    async function fetchSpends() {
      if (shouldWaitPendingSpends) {
        return;
      }

      setLoading(true);

      if (validOnly && !claimableIds) {
        setSpends(EmptyList);
        setLoading(false);
        return;
      }

      const params = {
        page: page ?? 1,
        pageSize: pageSize ?? defaultPageSize,
        simple: true,
      };

      if (status) {
        params.status = upperFirst(status);
      }

      if (validOnly) {
        params.valid_only = true;
        params.ids = claimableIds;
      }

      const { result } = await nextApi.fetch("treasury/spends", params);
      setSpends(result ?? EmptyList);
      setLoading(false);
    }

    fetchSpends();
  }, [
    router.isReady,
    page,
    pageSize,
    status,
    validOnly,
    shouldWaitPendingSpends,
    claimableIds,
  ]);

  return {
    spends,
    loading,
  };
}
