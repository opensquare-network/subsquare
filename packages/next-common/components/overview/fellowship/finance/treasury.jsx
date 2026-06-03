import SummaryItem from "next-common/components/summary/layout/item";
import LoadableContent from "next-common/components/common/loadableContent";
import NativeTokenSymbolAsset from "next-common/components/summary/polkadotTreasurySummary/common/nativeTokenSymbolAsset";
import FiatPriceLabel from "next-common/components/summary/polkadotTreasurySummary/common/fiatPriceLabel";
import { StatemintFellowShipTreasuryAccount } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import { useAssetHubApi } from "next-common/hooks/chain/useAssetHubApi";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import { toPrecision } from "next-common/utils";
import TokenSymbolAsset from "next-common/components/summary/polkadotTreasurySummary/common/tokenSymbolAsset";
import {
  HYDRATION_ASSET_IDS,
  HOLLAR_DECIMALS,
  useFetchHollarBalance,
  useHydrationCurrencyBalance,
  ExternalLink,
} from "./common";
import { useFiatPrice } from "next-common/context/fiatPrice";
import bigAdd from "next-common/utils/math/bigAdd";

function useFetchFellowshipTreasuryBalance() {
  const api = useAssetHubApi();
  const { result, loading } = useSubStorage(
    "system",
    "account",
    [StatemintFellowShipTreasuryAccount],
    {
      api,
    },
  );

  return { balance: result?.data?.free?.toString() || 0, loading };
}

export default function FellowshipTreasury() {
  const { balance: dotAhBalance, loading: dotAhLoading } =
    useFetchFellowshipTreasuryBalance();
  const { balance: hollarAhBalance, loading: hollarAhLoading } =
    useFetchHollarBalance(StatemintFellowShipTreasuryAccount);

  const { balance: dotHydrationBalance, loading: dotHydrationLoading } =
    useHydrationCurrencyBalance(
      HYDRATION_ASSET_IDS.DOT,
      StatemintFellowShipTreasuryAccount,
    );
  const { balance: hollarHydrationBalance, loading: hollarHydrationLoading } =
    useHydrationCurrencyBalance(
      HYDRATION_ASSET_IDS.HOLLAR,
      StatemintFellowShipTreasuryAccount,
    );

  const { price: fiatPrice, loading: fiatPriceLoading } = useFiatPrice();

  const dotBalance = bigAdd(dotAhBalance, dotHydrationBalance);
  const hollarBalance = bigAdd(hollarAhBalance, hollarHydrationBalance);

  const loading =
    dotAhLoading ||
    hollarAhLoading ||
    dotHydrationLoading ||
    hollarHydrationLoading ||
    fiatPriceLoading;

  const Title = (
    <ExternalLink
      href={`https://assethub-polkadot.statescan.io/#/accounts/${StatemintFellowShipTreasuryAccount}`}
    >
      Treasury ↗
    </ExternalLink>
  );

  return (
    <SummaryItem title={Title}>
      <LoadableContent isLoading={loading}>
        <div className="flex flex-col gap-[4px]">
          <div>
            <FiatPriceLabel
              free={dotBalance}
              hollarBalance={hollarBalance}
              fiatPrice={fiatPrice}
            />
          </div>
          <div className="flex items-center gap-x-1">
            <NativeTokenSymbolAsset free={dotBalance} />
          </div>
          <div className="flex items-center gap-x-1">
            <TokenSymbolAsset
              amount={toPrecision(hollarBalance, HOLLAR_DECIMALS)}
              symbol="HOLLAR"
              type="foreign"
            />
          </div>
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
