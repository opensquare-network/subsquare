import isNil from "lodash.isnil";
import LoadableContent from "next-common/components/common/loadableContent";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import TreasurySummaryAvailable from "next-common/components/summary/treasurySummary/available";
import TreasurySummaryNextBurn from "next-common/components/summary/treasurySummary/nextBurn";
import SpendPeriod from "next-common/components/summary/treasurySummary/spendPeriod";
import TreasurySummarySpendPeriodCountDown from "next-common/components/summary/treasurySummary/spendPeriodCountDown";
import useSpendPeriodSummary from "next-common/components/summary/treasurySummary/useSpendPeriodSummary";
import Summary from "next-common/components/summary/v2/base";
import { useChain } from "next-common/context/chain";
import { isKintsugiChain } from "next-common/utils/chain";
import useApi from "next-common/utils/hooks/useApi";
import useTreasuryFree from "next-common/utils/hooks/useTreasuryFree";

export default function TreasuryState() {
  const chain = useChain();
  const api = useApi();

  const free = useTreasuryFree(api);
  const summary = useSpendPeriodSummary();

  const items = [
    {
      title: "Available",
      content: (
        <LoadableContent isLoading={isNil(free)}>
          <TreasurySummaryAvailable free={free} />
        </LoadableContent>
      ),
    },
    {
      title: "To Be Awarded",
      content: "TODO",
    },
    {
      title: "Next Burn",
      content: (
        <LoadableContent isLoading={isNil(free)}>
          <TreasurySummaryNextBurn free={free} />
        </LoadableContent>
      ),
    },
    !isKintsugiChain(chain) && {
      title: "Spend Period",
      content: <SpendPeriod summary={summary} />,
      suffix: <TreasurySummarySpendPeriodCountDown summary={summary} />,
    },
  ].filter(Boolean);

  return (
    <div>
      <TitleContainer className="mb-4">Treasury State</TitleContainer>

      <SecondaryCard>
        <Summary items={items} />
      </SecondaryCard>
    </div>
  );
}
