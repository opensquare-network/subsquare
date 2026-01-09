import { useMemo } from "react";
import { useAsync } from "react-use";
import { backendApi } from "next-common/services/nextApi";
import { isNil } from "lodash-es";
import ProposalsList from "../yearStatus/proposalsList";
import SpendsList from "../yearStatus/spendsList";
import ChildBountiesList from "../yearStatus/childBountiesList";
import TipsList from "../yearStatus/tipsList";

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
      bounties: detail?.bounties?.totalFiatValueAtFinal,
      proposals: detail?.treasuryProposals?.totalFiatValueAtFinal,
      spends: detail?.spends?.totalFiatValueAtFinal,
      tips: detail?.tips?.totalFiatValueAtFinal,
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
        content: <ProposalsList proposals={detail?.treasuryProposals?.items} />,
      },
      {
        value: "spends",
        label: "Spends",
        activeCount: detail?.spends?.items?.length,
        total: detail?.spends?.totalFiatValueAtFinal,
        content: <SpendsList spends={detail?.spends?.items} />,
      },
      {
        value: "childBounties",
        label: "Child Bounties",
        activeCount: detail?.childBounties?.items?.length,
        total: detail?.childBounties?.totalFiatValueAtFinal,
        content: (
          <ChildBountiesList childBounties={detail?.childBounties?.items} />
        ),
      },
      {
        value: "tips",
        label: "Tips",
        activeCount: detail?.tips?.items?.length,
        total: detail?.tips?.totalFiatValueAtFinal,
        content: <TipsList tips={detail?.tips?.items} loading={false} />,
      },
      {
        value: "bounties",
        label: "Bounties",
        activeCount: detail?.bounties?.items?.length,
        total: detail?.bounties?.totalFiatValueAtFinal,
      },
    ].filter((item) => item.activeCount > 0);
  }, [detail]);

  return {
    summary,
    tabs,
  };
}
