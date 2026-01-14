import { memo } from "react";
import {
  SearchType,
  getCategoryName,
  getCategoryPath,
  getSearchItemPath,
} from "next-common/components/header/search/common/commonList";
import {
  MenuReferenda,
  MenuDemocracy,
  MenuBounties,
  MenuChildBounties,
  MenuTreasurySpend,
  MenuTreasuryProposal,
} from "@osn/icons/subsquare";
import Link from "next-common/components/link";
import { ItemType } from "next-common/components/header/hooks/useSearchResults";
import CommonSearchItem, {
  handleLinkClick,
  IdentitySearchItem,
  MemberSearchItem,
} from "./commonSearchItem";
import TreasuryFundedProjectSearchItem from "./projectSearchItem";

function SearchItemCategory({ href, category, onClose }) {
  return (
    <Link
      href={href}
      className="cursor-pointer"
      onClick={(e) => {
        handleLinkClick(e, onClose);
      }}
    >
      <div className="h-9 px-2 py-2.5 rounded-[6px] flex items-center text12Medium text-textTertiary">
        {category}
      </div>
    </Link>
  );
}

const SearchItem = memo(function ItemContent({ row, onClose }) {
  const { type, proposalType } = row;

  if (type === ItemType.CATEGORY) {
    const path = getCategoryPath(proposalType);
    const category = getCategoryName(proposalType);
    return (
      <SearchItemCategory href={path} category={category} onClose={onClose} />
    );
  }

  if (proposalType === SearchType.IDENTITIES) {
    const { fullDisplay, account } = row;
    return (
      <IdentitySearchItem
        address={account}
        name={fullDisplay || "-"}
        onClose={onClose}
      />
    );
  }

  if (proposalType === SearchType.FELLOWSHIP_MEMBERS) {
    const { name, address, rank } = row;
    return (
      <MemberSearchItem
        address={address}
        rank={rank}
        name={name}
        onClose={onClose}
      />
    );
  }

  const { index, displayIndex, title, content, noDisplayIndex } = row;
  const path = getSearchItemPath(proposalType, index);
  let searchItemTitle = title;
  if (!noDisplayIndex) {
    searchItemTitle = `#${displayIndex || index} · ${title}`;
  }

  if (proposalType === SearchType.REFERENDA) {
    return (
      <CommonSearchItem
        IconComponent={MenuReferenda}
        title={searchItemTitle}
        content={content}
        href={path}
        onClose={onClose}
      />
    );
  }

  if (proposalType === SearchType.DEMOCRACY_REFERENDA) {
    return (
      <CommonSearchItem
        IconComponent={MenuDemocracy}
        title={searchItemTitle}
        content={content}
        href={path}
        onClose={onClose}
      />
    );
  }

  if (proposalType === SearchType.BOUNTIES) {
    return (
      <CommonSearchItem
        IconComponent={MenuBounties}
        title={searchItemTitle}
        content={content}
        href={path}
        onClose={onClose}
      />
    );
  }

  if (proposalType === SearchType.CHILD_BOUNTIES) {
    return (
      <CommonSearchItem
        IconComponent={MenuChildBounties}
        title={searchItemTitle}
        content={content}
        href={path}
        onClose={onClose}
      />
    );
  }

  if (proposalType === SearchType.TREASURY_PROPOSALS) {
    return (
      <CommonSearchItem
        IconComponent={MenuTreasuryProposal}
        title={searchItemTitle}
        content={content}
        href={path}
        onClose={onClose}
      />
    );
  }

  if (proposalType === SearchType.TREASURY_SPENDS) {
    return (
      <CommonSearchItem
        IconComponent={MenuTreasurySpend}
        title={searchItemTitle}
        content={content}
        href={path}
        onClose={onClose}
      />
    );
  }

  if (proposalType === SearchType.TREASURY_TIPS) {
    return (
      <CommonSearchItem
        IconComponent={MenuTreasurySpend}
        title={searchItemTitle}
        content={content}
        href={path}
        onClose={onClose}
      />
    );
  }

  if (proposalType === SearchType.FELLOWSHIP_REFERENDA) {
    return (
      <CommonSearchItem
        IconComponent={MenuReferenda}
        title={searchItemTitle}
        content={content}
        href={path}
        onClose={onClose}
      />
    );
  }

  if (proposalType === SearchType.FELLOWSHIP_TREASURY_SPENDS) {
    return (
      <CommonSearchItem
        IconComponent={MenuTreasurySpend}
        title={searchItemTitle}
        content={content}
        href={path}
        onClose={onClose}
      />
    );
  }

  if (proposalType === SearchType.TREASURY_FUNDED_PROJECTS) {
    return <TreasuryFundedProjectSearchItem row={row} onClose={onClose} />;
  }
});

export default SearchItem;
