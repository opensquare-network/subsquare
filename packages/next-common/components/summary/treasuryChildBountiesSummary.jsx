import SummaryItem from "./layout/item";
import SummaryLayout from "./layout/layout";
import { isPolkadotChain, isKusamaChain } from "next-common/utils/chain";
import { useChain } from "next-common/context/chain";
import TreasurySummary from "./treasurySummary";
import { useAsync } from "react-use";
import { backendApi } from "next-common/services/nextApi";
import LoadableContent from "../common/loadableContent";
import { FiatValueItem } from "./treasurySpendsSummary";
import Tooltip from "next-common/components/tooltip";
import { useRouter } from "next/router";

function useChildBountiesSummaryData() {
  const router = useRouter();
  const parent = router?.query?.parentBountyId;
  const apiUrl = parent
    ? `treasury/bounty/${parent}/child-bounties/summary`
    : "treasury/child-bounties/summary";

  const { value: childBountiesSummary, loading } = useAsync(async () => {
    const { result } = await backendApi.fetch(apiUrl);
    return result;
  }, [apiUrl]);

  const { totalChildBountiesCount, detail = {} } = childBountiesSummary ?? {};

  return {
    totalChildBountiesCount,
    detail,
    loading,
  };
}

function getFirstDayOfCurrentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = "01";
  return `${year}.${month}.${day}`;
}

function ClaimedThisMonthTitle() {
  return (
    <Tooltip content={`Start from ${getFirstDayOfCurrentMonth()}`}>
      <span>Claimed this month</span>
    </Tooltip>
  );
}

function TreasuryChildBountiesSummaryImpl() {
  const { totalChildBountiesCount, detail, loading } =
    useChildBountiesSummaryData();

  return (
    <LoadableContent isLoading={loading}>
      <SummaryLayout>
        <SummaryItem title="Total">{totalChildBountiesCount ?? 0}</SummaryItem>
        <SummaryItem title="PendingPayout">
          <FiatValueItem
            count={detail?.PendingPayout?.count ?? 0}
            fiatValue={detail?.PendingPayout?.fiatValue ?? 0}
          />
        </SummaryItem>
        <SummaryItem title="Claimed">
          <FiatValueItem
            count={detail?.Claimed?.count ?? 0}
            fiatValue={detail?.Claimed?.fiatValue ?? 0}
          />
        </SummaryItem>
        <SummaryItem title={<ClaimedThisMonthTitle />}>
          <FiatValueItem
            count={detail?.ClaimedInOneMonth?.count ?? 0}
            fiatValue={detail?.ClaimedInOneMonth?.fiatValue ?? 0}
          />
        </SummaryItem>
      </SummaryLayout>
    </LoadableContent>
  );
}

export default function TreasuryChildBountiesSummary() {
  const chain = useChain();
  if (isPolkadotChain(chain) || isKusamaChain(chain)) {
    return <TreasuryChildBountiesSummaryImpl />;
  }

  return <TreasurySummary />;
}
