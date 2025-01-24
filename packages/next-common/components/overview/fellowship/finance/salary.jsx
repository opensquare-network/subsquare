import SummaryItem from "next-common/components/summary/layout/item";
import Link from "next/link";
import LoadableContent from "next-common/components/common/loadableContent";
import DotTokenSymbolAsset from "next-common/components/summary/polkadotTreasurySummary/common/dotTokenSymbolAsset";
import FiatPriceLabel from "next-common/components/summary/polkadotTreasurySummary/common/fiatPriceLabel";
import { StatemintFellowShipSalaryAccount } from "next-common/context/treasury/polkadotTreasury/hooks/useQueryFellowshipSalaryBalance";

export default function FellowshipSalary() {
  // TODO: fetch data
  const isLoading = false;
  const dot = 123456789;

  const Title = (
    <>
      <Link
        href={`https://assethub-polkadot.subscan.io/account/${StatemintFellowShipSalaryAccount}`}
        className="text12Medium text-textTertiary hover:underline"
        target="_blank"
        rel="noreferrer"
      >
        Salary ↗
      </Link>
    </>
  );

  return (
    <SummaryItem title={Title}>
      <LoadableContent isLoading={isLoading}>
        <div className="flex flex-col gap-[4px]">
          <div>
            <FiatPriceLabel free={dot} />
          </div>
          <div className="flex flex-col gap-y-1 !ml-0">
            <DotTokenSymbolAsset free={dot} />
          </div>
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
