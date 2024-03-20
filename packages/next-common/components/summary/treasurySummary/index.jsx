import useTreasuryFree from "../../../utils/hooks/useTreasuryFree";
import { useChain } from "../../../context/chain";
import Summary from "..";
import TreasurySummaryNextBurn from "./nextBurn";
import { isKintsugiChain } from "next-common/utils/chain";
import SpendPeriod from "next-common/components/summary/treasurySummary/spendPeriod";
import useSpendPeriodSummary from "next-common/components/summary/treasurySummary/useSpendPeriodSummary";
import LoadableContent from "next-common/components/common/loadableContent";
import { isNil } from "lodash-es";
import TreasurySummaryAvailable from "./available";
import TreasurySummarySpendPeriodCountDown from "./spendPeriodCountDown";
import { gql } from "@apollo/client";
import { useDoTreasuryEcoQuery } from "next-common/hooks/apollo";
import useToBeAwarded from "next-common/hooks/useToBeAwarded";
import TreasurySummaryToBeAwarded from "./toBeAwarded";
import bifrostPolkadot from "next-common/utils/consts/settings/bifrostPolkadot";
import bifrost from "next-common/utils/consts/settings/bifrost";
import { find } from "lodash-es";
import { useContextApi } from "next-common/context/api";

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

export default function TreasurySummary() {
  const chain = useChain();
  const api = useContextApi();

  const free = useTreasuryFree(api);
  const summary = useSpendPeriodSummary();
  const toBeAwarded = useToBeAwarded();

  const { data } = useDoTreasuryEcoQuery(GET_TREASURIES);
  const treasury = find(data?.treasuries, {
    chain: CHAIN_VALUE_TREASURY_MAP[chain] || chain,
  });

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
              <TreasurySummaryAvailable
                free={free}
                fiatPrice={treasury?.price}
              />
            </LoadableContent>
          ),
        },
        !isKintsugiChain(chain) && {
          title: "To Be Awarded",
          content: (
            <LoadableContent isLoading={isNil(toBeAwarded)}>
              <TreasurySummaryToBeAwarded
                toBeAwarded={toBeAwarded}
                fiatPrice={treasury?.price}
              />
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
