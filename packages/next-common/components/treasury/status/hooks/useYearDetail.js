import { useMemo } from "react";
import { useAsync } from "react-use";
import { backendApi } from "next-common/services/nextApi";
import { isNil } from "lodash-es";
import TreasuryItemsList, { TYPES } from "../yearStatus/treasuryItemsList";

export default function useYearDetail(year) {
  const { value: yearDetail, loading } = useAsync(async () => {
    if (isNil(year)) {
      return null;
    }
    const result = await backendApi.fetch(`/treasury/years/${year}`);
    return result?.result || {};
  }, [year]);

  return {
    yearDetail,
    loading,
  };
}

export function useYearSummary(detail) {
  const summary = useMemo(() => {
    if (isNil(detail)) {
      return {};
    }

    return {
      total: detail?.totalFiatValueAtFinal,
      proposals: detail?.treasuryProposals?.totalFiatValueAtFinal,
      spends: detail?.spends?.totalFiatValueAtFinal,
      tips: detail?.tips?.totalFiatValueAtFinal,
      bounties: detail?.bounties?.totalFiatValueAtFinal,
      childBounties: detail?.childBounties?.totalFiatValueAtFinal,
    };
  }, [detail]);

  const tabs = useMemo(() => {
    if (isNil(detail)) {
      return [];
    }

    return [
      {
        value: "proposals",
        label: "Proposals",
        activeCount: detail?.treasuryProposals?.items?.length,
        total: detail?.treasuryProposals?.totalFiatValueAtFinal,
        content: (
          <TreasuryItemsList
            type={TYPES.PROPOSALS}
            items={detail?.treasuryProposals?.items}
          />
        ),
      },
      {
        value: "spends",
        label: "Spends",
        activeCount: detail?.spends?.items?.length,
        total: detail?.spends?.totalFiatValueAtFinal,
        content: (
          <TreasuryItemsList
            type={TYPES.SPENDS}
            items={detail?.spends?.items}
          />
        ),
      },
      {
        value: "tips",
        label: "Tips",
        activeCount: detail?.tips?.items?.length,
        total: detail?.tips?.totalFiatValueAtFinal,
        content: (
          <TreasuryItemsList type={TYPES.TIPS} items={detail?.tips?.items} />
        ),
      },
      {
        value: "bounties",
        label: "Bounties",
        activeCount: detail?.bounties?.items?.length,
        total: detail?.bounties?.totalFiatValueAtFinal,
        content: (
          <TreasuryItemsList
            type={TYPES.BOUNTIES}
            items={detail?.bounties?.items}
          />
        ),
      },
      {
        value: "childBounties",
        label: "Child Bounties",
        activeCount: detail?.childBounties?.items?.length,
        total: detail?.childBounties?.totalFiatValueAtFinal,
        content: (
          <TreasuryItemsList
            type={TYPES.CHILD_BOUNTIES}
            items={detail?.childBounties?.items}
          />
        ),
      },
    ].filter((item) => item.activeCount > 0);
  }, [detail]);

  return {
    summary,
    tabs,
  };
}
