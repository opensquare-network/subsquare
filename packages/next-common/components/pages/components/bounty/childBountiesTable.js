import Anchor from "next-common/components/styled/anchor";
import { toPrecision } from "next-common/utils";
import Tag from "next-common/components/tags/state/tag";
import businessCategory from "next-common/utils/consts/business/category";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { cn } from "next-common/utils";
import KvList from "next-common/components/listInfo/kvList";
import Link from "next-common/components/link";
import { getChildBountyIndex } from "next-common/utils/viewfuncs/treasury/childBounty";

function CBLink({ title, bounty, children }) {
  return (
    <Anchor
      href={`/treasury/child-bounties/${getChildBountyIndex(bounty)}`}
      title={title}
    >
      {children}
    </Anchor>
  );
}

export default function ChildBountiesTable({ childBounties }) {
  const { decimals, symbol } = useChainSettings();
  if (!childBounties?.items || !childBounties?.items?.length) {
    return null;
  }

  const listData = childBounties.items.map((bounty) => {
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
        <div className="w-[160px] text-textSecondary">
          <CBLink bounty={bounty}>#{bounty.index}</CBLink>
        </div>
        <div className="flex-1 w-full text-textPrimary!">
          <CBLink bounty={bounty} title={bounty.title}>
            {bounty.title}
          </CBLink>
        </div>
        <div className="w-[120px] text-right max-sm:text-left">
          <ValueDisplay
            value={toPrecision(bounty.onchainData?.value, decimals)}
            symbol={symbol}
          />
        </div>
        <div className="w-[120px] text-right max-sm:text-left">
          <Tag
            state={bounty.onchainData?.state?.state}
            category={businessCategory.treasuryChildBounties}
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
            href={`/treasury/child-bounties?parentBountyId=${childBounties.items[0].parentBountyId}`}
            className="text14Medium text-theme500"
          >
            View all
          </Link>
        </div>
      )}
    </div>
  );
}
