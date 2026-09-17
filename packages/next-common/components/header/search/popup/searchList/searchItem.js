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
  InfoDocs,
} from "@osn/icons/subsquare";
import Link from "next-common/components/link";
import { ItemType } from "next-common/components/header/search/utils/items";
import CommonSearchItem, {
  CommonSearchItemContent,
  handleLinkClick,
  IdentitySearchItem,
  MemberSearchItem,
} from "./commonSearchItem";
import TreasuryFundedProjectSearchItem from "./projectSearchItem";

const PROPOSAL_TYPE_ICONS = {
  [SearchType.REFERENDA]: MenuReferenda,
  [SearchType.DEMOCRACY_REFERENDA]: MenuDemocracy,
  [SearchType.BOUNTIES]: MenuBounties,
  [SearchType.CHILD_BOUNTIES]: MenuChildBounties,
  [SearchType.TREASURY_PROPOSALS]: MenuTreasuryProposal,
  [SearchType.TREASURY_SPENDS]: MenuTreasurySpend,
  [SearchType.TREASURY_TIPS]: MenuTreasurySpend,
  [SearchType.FELLOWSHIP_REFERENDA]: MenuReferenda,
  [SearchType.FELLOWSHIP_TREASURY_SPENDS]: MenuTreasurySpend,
};

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

  if (proposalType === SearchType.WIKI) {
    const content = (
      <CommonSearchItemContent
        IconComponent={InfoDocs}
        title={row.title}
        content={row.content}
      />
    );

    if (!row.href) {
      return <div>{content}</div>;
    }

    return (
      <a
        href={row.href}
        target="_blank"
        rel="noopener noreferrer"
        className="cursor-pointer"
      >
        {content}
      </a>
    );
  }

  const { index, displayIndex, title, content, noDisplayIndex, highlight } =
    row;
  const path = getSearchItemPath(proposalType, index);
  let searchItemTitle = title;
  let searchItemTitleHighlight = highlight?.title;
  if (!noDisplayIndex) {
    searchItemTitle = `#${displayIndex || index} · ${title}`;
    if (searchItemTitleHighlight) {
      searchItemTitleHighlight = `#${
        displayIndex || index
      } · ${searchItemTitleHighlight}`;
    }
  }

  const IconComponent = PROPOSAL_TYPE_ICONS[proposalType];
  if (IconComponent) {
    return (
      <CommonSearchItem
        IconComponent={IconComponent}
        title={searchItemTitle}
        titleHighlight={searchItemTitleHighlight}
        content={content}
        contentHighlight={highlight?.content}
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
