import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import { useChainSettings } from "next-common/context/chain";
import LabelItem from "../common/labelItem";
import SpendPeriodCountdown from "./spendPeriodCountdown";
import ToBeAwarded from "./toBeAwarded";
import useTreasuryFree from "next-common/utils/hooks/useTreasuryFree";
import { useChain } from "next-common/context/chain";
import useSpendPeriodSummary from "next-common/components/summary/treasurySummary/useSpendPeriodSummary";
import { isNil } from "lodash-es";
import { gql } from "@apollo/client";
import { useDoTreasuryEcoQuery } from "next-common/hooks/apollo";
import bifrostPolkadot from "next-common/utils/consts/settings/bifrostPolkadot";
import bifrost from "next-common/utils/consts/settings/bifrost";
import { find } from "lodash-es";
import { useContextApi } from "next-common/context/api";
import useToBeAwarded from "next-common/hooks/useToBeAwarded";
import NextBurn from "./nextBurn";
import SpendPeriod from "./spendPeriod";
import Total from "./total";
import PolkadotTokenSymbol from "./polkadotTokenSymbol";

const GET_TREASURIES = gql`
  query GetTreasuries {
    treasuries {
      chain
      price
    }
  }
`;

const CHAIN_VALUE_TREASURY_MAP = {
  [bifrostPolkadot.value]: bifrost.value,
};

export default function RelayChainTreasury() {
  const chain = useChain();
  const api = useContextApi();

  const free = useTreasuryFree(api);
  const summary = useSpendPeriodSummary();
  const toBeAwarded = useToBeAwarded();

  const { data } = useDoTreasuryEcoQuery(GET_TREASURIES);
  const treasury = find(data?.treasuries, {
    chain: CHAIN_VALUE_TREASURY_MAP[chain] || chain,
  });

  return (
    <SummaryItem title="Relay Chain Treasury">
      <LoadableContent isLoading={isNil(free) || isNil(treasury)}>
        <Total free={free} fiatPrice={treasury?.price} />
      </LoadableContent>
      <div className="!ml-0">
        <LoadableContent isLoading={isNil(free)}>
          <PolkadotTokenSymbol free={free} />
        </LoadableContent>
        <LabelItem label={"To be awarded"}>
          <LoadableContent isLoading={isNil(toBeAwarded) || isNil(treasury)}>
            <ToBeAwarded
              toBeAwarded={toBeAwarded}
              fiatPrice={treasury?.price}
            />
          </LoadableContent>
        </LabelItem>
        <LabelItem label={"Next burn"}>
          <LoadableContent isLoading={isNil(free)}>
            <NextBurn free={free} />
          </LoadableContent>
        </LabelItem>
        <LabelItem label={"Spend period"}>
          <LoadableContent isLoading={isNil(summary)}>
            <SpendPeriod summary={summary} />
            <SpendPeriodCountdown summary={summary} />
          </LoadableContent>
        </LabelItem>
      </div>
    </SummaryItem>
  );
}
