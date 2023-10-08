import React from "react";
import CountDown from "../countDown";
import { abbreviateBigNumber, toPrecision } from "../../../utils";
import useApi from "../../../utils/hooks/useApi";
import useTreasuryFree from "../../../utils/hooks/useTreasuryFree";
import { useChain, useChainSettings } from "../../../context/chain";
import Summary from "../v2/base";
import TreasuryBurn from "../treasurySummaryItems/burn";
import { isKintsugiChain } from "next-common/utils/chain";
import SpendPeriod from "next-common/components/summary/treasurySummary/spendPeriod";
import useSpendPeriodSummary from "next-common/components/summary/treasurySummary/useSpendPeriodSummary";
import LoadableContent from "next-common/components/common/loadableContent";
import isNil from "lodash.isnil";

export default function TreasurySummary() {
  const chain = useChain();
  const api = useApi();
  const node = useChainSettings();

  const decimals = node?.decimals;
  const symbol = node?.symbol;

  const free = useTreasuryFree(api);
  const summary = useSpendPeriodSummary();

  const spendPeriodsItem = {
    title: "Spend Period",
    content: <SpendPeriod summary={summary} />,
    suffix: (
      <div className="flex max-sm:hidden">
        <CountDown percent={summary?.progress ?? 0} />
      </div>
    ),
  };

  return (
    <Summary
      items={[
        {
          title: "Available",
          content: (
            <LoadableContent isLoading={isNil(free)}>
              <span>
                {abbreviateBigNumber(toPrecision(free || 0, decimals))}
              </span>
              <span className="unit upper">{symbol}</span>
            </LoadableContent>
          ),
        },
        {
          title: "Next Burn",
          content: (
            <LoadableContent isLoading={isNil(free)}>
              <TreasuryBurn free={free} />
            </LoadableContent>
          ),
        },
        isKintsugiChain(chain) ? null : spendPeriodsItem,
      ].filter(Boolean)}
    />
  );
}
