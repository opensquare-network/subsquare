import SummaryItem from "next-common/components/summary/layout/item";
import LoadableContent from "next-common/components/common/loadableContent";
import NativeTokenSymbolAsset from "next-common/components/summary/polkadotTreasurySummary/common/nativeTokenSymbolAsset";
import FiatPriceLabel from "next-common/components/summary/polkadotTreasurySummary/common/fiatPriceLabel";
import { StatemintFellowShipTreasuryAccount } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import { useAssetHubApi } from "next-common/hooks/chain/useAssetHubApi";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import { toPrecision } from "next-common/utils";
import TokenSymbolAsset from "next-common/components/summary/polkadotTreasurySummary/common/tokenSymbolAsset";
import { useAsync } from "react-use";

const HOLLAR_FOREIGN_ASSET_KEY = {
  parents: 1,
  interior: {
    X2: [{ Parachain: 2034 }, { GeneralIndex: "222" }],
  },
};

const HOLLAR_DECIMALS = 18;

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

function useFetchFellowshipTreasuryHollarBalance() {
  const api = useAssetHubApi();

  const { loading, value } = useAsync(async () => {
    if (!api) {
      return;
    }

    const result = await api?.query?.foreignAssets?.account(
      HOLLAR_FOREIGN_ASSET_KEY,
      StatemintFellowShipTreasuryAccount,
    );

    return result?.toJSON()?.balance || "0";
  }, [api]);

  return { balance: value || "0", loading };
}

function ExternalLink({ href, children }) {
  return (
    <a
      href={href}
      className="text12Medium text-textTertiary hover:underline"
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
}

export default function FellowshipTreasury() {
  const { balance: dotBalance, loading: dotLoading } =
    useFetchFellowshipTreasuryBalance();
  const { balance: hollarBalance, loading: hollarLoading } =
    useFetchFellowshipTreasuryHollarBalance();

  const Title = (
    <ExternalLink
      href={`https://assethub-polkadot.statescan.io/#/accounts/${StatemintFellowShipTreasuryAccount}`}
    >
      Treasury ↗
    </ExternalLink>
  );

  return (
    <SummaryItem title={Title}>
      <LoadableContent isLoading={dotLoading || hollarLoading}>
        <div className="flex flex-col gap-[4px]">
          <div>
            <FiatPriceLabel free={dotBalance} />
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
