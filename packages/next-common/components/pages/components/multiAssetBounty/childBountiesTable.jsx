import Anchor from "next-common/components/styled/anchor";
import { toPrecision } from "next-common/utils";
import businessCategory from "next-common/utils/consts/business/category";
import { MultiAssetChildBountyTag } from "next-common/components/tags/state/treasury";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { cn } from "next-common/utils";
import KvList from "next-common/components/listInfo/kvList";
import Link from "next-common/components/link";
import { getAssetInfoFromAssetKind } from "next-common/utils/treasury/multiAssetBounty/assetKind";

function ChildBountyValue({ value, assetKind }) {
  const { decimals: chainDecimals, symbol: chainSymbol } = useChainSettings();
  const { symbol, decimals } = getAssetInfoFromAssetKind(
    assetKind,
    chainDecimals,
    chainSymbol,
  );
  return <ValueDisplay value={toPrecision(value, decimals)} symbol={symbol} />;
}

export default function MultiAssetChildBountiesTable({ childBounties }) {
  if (!childBounties?.items || !childBounties?.items?.length) {
    return null;
  }

  const listData = childBounties.items.map((bounty) => {
    const assetKind = bounty.onchainData?.assetKind;
    return [
      <div
        key={bounty.index}
        className={cn(
          "flex items-center",
          "w-full",
          "text14Medium",
          "max-sm:block max-sm:space-y-2",
        )}
      >
        <div className="w-[160px] text-textSecondary">#{bounty.index}</div>
        <div className="flex-1 w-full">
          <Anchor
            className="!text-textPrimary"
            href={`/treasury/multi-asset-child-bounties/${bounty.parentBountyId}_${bounty.index}`}
            title={bounty.title}
          >
            {bounty.title}
          </Anchor>
        </div>
        <div className="w-[120px] text-right max-sm:text-left">
          {bounty.onchainData?.value != null && (
            <ChildBountyValue
              value={bounty.onchainData.value}
              assetKind={assetKind}
            />
          )}
        </div>
        <div className="w-[120px] text-right max-sm:text-left">
          <MultiAssetChildBountyTag
            state={bounty.onchainData?.state?.state}
            category={businessCategory.multiAssetChildBounties}
          />
        </div>
      </div>,
    ];
  });

  return (
    <div>
      <KvList data={listData} />

      {childBounties.total > 5 && (
        <div className="mt-4 text-right">
          <Link
            href={`/treasury/multi-asset-child-bounties?parentBountyId=${childBounties.items[0]?.parentBountyId}`}
            className="text14Medium text-theme500"
          >
            View all
          </Link>
        </div>
      )}
    </div>
  );
}
