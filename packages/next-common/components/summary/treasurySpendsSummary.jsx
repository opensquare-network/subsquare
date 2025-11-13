import ValueDisplay from "../valueDisplay";
import SummaryItem from "./layout/item";
import SummaryLayout from "./layout/layout";
import SummaryLabelItem from "./polkadotTreasurySummary/common/summaryLabelItem";
import { isKintsugiChain } from "next-common/utils/chain";
import { useChain } from "next-common/context/chain";
import TreasurySummary from "./treasurySummary";
import isHydradx from "next-common/utils/isHydradx";
import { useAsync } from "react-use";
import { backendApi } from "next-common/services/nextApi";
import LoadableContent from "../common/loadableContent";

export default function TreasurySpendsSummary() {
  const chain = useChain();

  if (isKintsugiChain(chain) || isHydradx(chain)) {
    return <TreasurySummary />;
  }

  return <TreasurySpendsSummaryImpl />;
}

function TreasurySpendsSummaryImpl() {
  const { value: spendsSummary, loading } = useAsync(async () => {
    const { result } = await backendApi.fetch("treasury/spends/summary");
    return result;
  }, []);

  const { totalProposalsCount, detail = {} } = spendsSummary ?? {};

  return (
    <LoadableContent isLoading={loading}>
      <SummaryLayout>
        <SummaryItem title="Total">{totalProposalsCount}</SummaryItem>
        <SummaryItem title="Approved">
          <FiatValueItem
            count={detail?.Approved?.proposalsCount ?? 0}
            fiatValue={detail?.Approved?.fiatValue ?? 0}
          />
        </SummaryItem>
        <SummaryItem title="Paid">
          <FiatValueItem
            count={detail?.Paid?.proposalsCount ?? 0}
            fiatValue={detail?.Paid?.fiatValue ?? 0}
          />
        </SummaryItem>
        <SummaryItem title="Expired">
          <FiatValueItem
            count={detail?.Expired?.proposalsCount ?? 0}
            fiatValue={detail?.Expired?.fiatValue ?? 0}
          />
        </SummaryItem>
      </SummaryLayout>
    </LoadableContent>
  );
}

function FiatValueItem({ count, fiatValue }) {
  return (
    <div className="flex flex-col">
      {count ?? 0}
      <SummaryLabelItem label="total">
        <ValueDisplay
          className="text-textPrimary"
          value={fiatValue ?? 0}
          symbol=""
          prefix="$"
        />
      </SummaryLabelItem>
    </div>
  );
}
