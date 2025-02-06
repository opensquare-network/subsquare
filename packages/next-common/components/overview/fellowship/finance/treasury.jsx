import SummaryItem from "next-common/components/summary/layout/item";
import Link from "next/link";
import LoadableContent from "next-common/components/common/loadableContent";
import DotTokenSymbolAsset from "next-common/components/summary/polkadotTreasurySummary/common/dotTokenSymbolAsset";
import FiatPriceLabel from "next-common/components/summary/polkadotTreasurySummary/common/fiatPriceLabel";
import { StatemintFellowShipTreasuryAccount } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import { useAssetHubApi } from "next-common/hooks/chain/useAssetHubApi";
import useSubStorage from "next-common/hooks/common/useSubStorage";

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
  const { balance, loading } = useFetchFellowshipTreasuryBalance();

  const Title = (
    <>
      <Link
        href={`https://assethub-polkadot.subscan.io/account/${StatemintFellowShipTreasuryAccount}`}
        className="text12Medium text-textTertiary hover:underline"
        target="_blank"
        rel="noreferrer"
      >
        Treasury ↗
      </Link>
    </>
  );

  return (
    <SummaryItem title={Title}>
      <LoadableContent isLoading={loading}>
        <div className="flex flex-col gap-[4px]">
          <div>
            <FiatPriceLabel free={balance} />
          </div>
          <div className="flex flex-col gap-y-1 !ml-0">
            <DotTokenSymbolAsset free={balance} />
          </div>
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
