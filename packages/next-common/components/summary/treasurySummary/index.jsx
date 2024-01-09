import useApi from "../../../utils/hooks/useApi";
import useTreasuryFree from "../../../utils/hooks/useTreasuryFree";
import { useChain } from "../../../context/chain";
import Summary from "../v2/base";
import TreasurySummaryNextBurn from "./nextBurn";
import { isKintsugiChain } from "next-common/utils/chain";
import SpendPeriod from "next-common/components/summary/treasurySummary/spendPeriod";
import useSpendPeriodSummary from "next-common/components/summary/treasurySummary/useSpendPeriodSummary";
import LoadableContent from "next-common/components/common/loadableContent";
import isNil from "lodash.isnil";
import TreasurySummaryAvailable from "./available";
import TreasurySummarySpendPeriodCountDown from "./spendPeriodCountDown";

export default function TreasurySummary() {
  const chain = useChain();
  const api = useApi();

  const free = useTreasuryFree(api);
  const summary = useSpendPeriodSummary();

  const spendPeriodsItem = {
    title: "Spend Period",
    content: <SpendPeriod summary={summary} />,
    suffix: <TreasurySummarySpendPeriodCountDown summary={summary} />,
  };

  return (
    <Summary
      items={[
        {
          title: "Available",
          content: (
            <LoadableContent isLoading={isNil(free)}>
              <TreasurySummaryAvailable free={free} />
            </LoadableContent>
          ),
        },
        {
          title: "Next Burn",
          content: (
            <LoadableContent isLoading={isNil(free)}>
              <TreasurySummaryNextBurn free={free} />
            </LoadableContent>
          ),
        },
        isKintsugiChain(chain) ? null : spendPeriodsItem,
      ].filter(Boolean)}
    />
  );
}
