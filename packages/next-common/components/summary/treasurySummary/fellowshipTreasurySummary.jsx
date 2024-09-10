import useTreasuryFree from "../../../utils/hooks/useTreasuryFree";
import { useChain } from "../../../context/chain";
import { isKintsugiChain } from "next-common/utils/chain";
import LoadableContent from "next-common/components/common/loadableContent";
import { isNil } from "lodash-es";
import TreasurySummaryAvailable from "./available";
import { gql } from "@apollo/client";
import { useDoTreasuryEcoQuery } from "next-common/hooks/apollo";
import TreasurySummaryToBeAwarded from "./toBeAwarded";
import bifrostPolkadot from "next-common/utils/consts/settings/bifrostPolkadot";
import bifrost from "next-common/utils/consts/settings/bifrost";
import { find } from "lodash-es";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import useToBeAwarded from "next-common/hooks/useToBeAwarded";
import { useAssetHubApi } from "next-common/context/assetHub";

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

export default function FellowshipTreasurySummary() {
  const chain = useChain();
  const api = useAssetHubApi();
  const free = useTreasuryFree(api);
  const toBeAwarded = useToBeAwarded(api);

  const { data } = useDoTreasuryEcoQuery(GET_TREASURIES);
  const treasury = find(data?.treasuries, {
    chain: CHAIN_VALUE_TREASURY_MAP[chain] || chain,
  });

  return (
    <SummaryLayout>
      <SummaryItem title="Available">
        <LoadableContent isLoading={isNil(free)}>
          <TreasurySummaryAvailable free={free} fiatPrice={treasury?.price} />
        </LoadableContent>
      </SummaryItem>
      {!isKintsugiChain(chain) && (
        <SummaryItem title="To Be Awarded">
          <LoadableContent isLoading={isNil(toBeAwarded)}>
            <TreasurySummaryToBeAwarded
              toBeAwarded={toBeAwarded}
              fiatPrice={treasury?.price}
            />
          </LoadableContent>
        </SummaryItem>
      )}
    </SummaryLayout>
  );
}
