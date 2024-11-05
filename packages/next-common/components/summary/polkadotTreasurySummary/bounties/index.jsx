import SummaryItem from "next-common/components/summary/layout/item";
import Link from "next/link";
import LoadableContent from "next-common/components/common/loadableContent";
import DotTokenSymbolAsset from "../common/dotTokenSymbolAsset";
import FiatPriceLabel from "../common/fiatPriceLabel";
import useQueryBountiesData from "../hook/useQueryBountiesData";

const TARGET_LINK = "https://polkadot.subsquare.io/treasury/bounties";

export default function Bounties() {
  // TODO: sum dot total
  const dot = "12345678";
  const { bountiesCount, isLoading } = useQueryBountiesData();

  const Title = (
    <>
      <Link
        href={TARGET_LINK}
        className="text12Medium text-textTertiary hover:underline"
        target="_blank"
        rel="noreferrer"
      >
        Bounties
      </Link>
      <span>{" · "}</span>
      <span>{bountiesCount}</span>
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
