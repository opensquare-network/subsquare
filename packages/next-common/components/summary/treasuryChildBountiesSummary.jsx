import SummaryItem from "./layout/item";
import SummaryLayout from "./layout/layout";
import { isKintsugiChain } from "next-common/utils/chain";
import { useChain } from "next-common/context/chain";
import TreasurySummary from "./treasurySummary";
import isHydradx from "next-common/utils/isHydradx";
import { useAsync } from "react-use";
import { backendApi } from "next-common/services/nextApi";
import LoadableContent from "../common/loadableContent";
import { FiatValueItem } from "./treasurySpendsSummary";
import Tooltip from "next-common/components/tooltip";

function getFirstDayOfCurrentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = "01";
  return `${year}.${month}.${day}`;
}

function ClaimedThisMonthTooltip() {
  const tooltipContent = `Start from ${getFirstDayOfCurrentMonth()}`;

  return (
    <Tooltip content={tooltipContent}>
      <span>Claimed this month</span>
    </Tooltip>
  );
}

export default function TreasuryChildBountiesSummary() {
  const chain = useChain();

  if (isKintsugiChain(chain) || isHydradx(chain)) {
    return <TreasurySummary />;
  }

  return <TreasuryChildBountiesSummaryImpl />;
}

function TreasuryChildBountiesSummaryImpl() {
  // TODO: api data
  const { value: childBountiesSummary, loading } = useAsync(async () => {
    const { result } = await backendApi.fetch("treasury/childBounties/summary");
    return result;
  }, []);

  const { totalProposalsCount, detail = {} } = childBountiesSummary ?? {};

  return (
    <LoadableContent isLoading={loading}>
      <SummaryLayout>
        <SummaryItem title="Total">{totalProposalsCount ?? 0}</SummaryItem>
        <SummaryItem title="PendingPayout">
          <FiatValueItem
            count={detail?.PendingPayout?.proposalsCount ?? 0}
            fiatValue={detail?.PendingPayout?.fiatValue ?? 0}
          />
        </SummaryItem>
        <SummaryItem title="Claimed">
          <FiatValueItem
            count={detail?.Claimed?.proposalsCount ?? 0}
            fiatValue={detail?.Claimed?.fiatValue ?? 0}
          />
        </SummaryItem>
        <SummaryItem title={<ClaimedThisMonthTooltip />}>
          <FiatValueItem
            count={detail?.ClaimedThisMonth?.proposalsCount ?? 0}
            fiatValue={detail?.ClaimedThisMonth?.fiatValue ?? 0}
          />
        </SummaryItem>
      </SummaryLayout>
    </LoadableContent>
  );
}
