import Anchor from "next-common/components/styled/anchor";
import { toPrecision } from "next-common/utils";
import Tag from "next-common/components/tags/state/tag";
import styled from "styled-components";
import businessCategory from "next-common/utils/consts/business/category";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import clsx from "clsx";
import KvList from "next-common/components/listInfo/kvList";

const DomesticLink = styled.a`
  margin-top: 16px;
  display: block;
  width: 60px;
  font-size: 12px;
  font-weight: 500;
  color: var(--theme500);
  cursor: pointer;
`;

export default function ChildBountiesTable({ childBounties }) {
  const { decimals, symbol } = useChainSettings();
  if (!childBounties?.items || !childBounties?.items?.length) {
    return null;
  }

  const listData = childBounties.items.map((bounty) => {
    return [
      <div
        key={bounty.index}
        className={clsx(
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
            href={`/treasury/child-bounties/${bounty.parentBountyId}_${bounty.index}`}
            title={bounty.title}
          >
            {bounty.title}
          </Anchor>
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
        <DomesticLink
          href={`/treasury/child-bounties?parentBountyId=${childBounties.items[0].parentBountyId}`}
        >
          View all
        </DomesticLink>
      )}
    </div>
  );
}
