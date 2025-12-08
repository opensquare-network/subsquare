import { memo } from "react";
import CommonList, {
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
import IdentityIcon from "next-common/components/Identity/identityIcon";
import useIdentityInfo from "next-common/hooks/useIdentityInfo";
import { FellowshipTagByRank } from "next-common/components/profile/fellowshipTagInfo";
import AddressAvatar from "next-common/components/user/addressAvatar";

function handleClick(e, onClose) {
  e.stopPropagation();
  if (e.metaKey || e.ctrlKey) {
    return;
  }
  onClose?.();
}

function SearchItemCategory({ href, category, onClose }) {
  return (
    <Link
      href={href}
      className="cursor-pointer"
      onClick={(e) => {
        handleClick(e, onClose);
      }}
    >
      <div className="h-9 px-2 py-2.5 rounded-[6px] flex items-center text12Medium text-textTertiary">
        {category}
      </div>
    </Link>
  );
}

function CommonSearchItem({ IconComponent, href, title, content, onClose }) {
  return (
    <Link
      href={href}
      className="cursor-pointer"
      onClick={(e) => {
        handleClick(e, onClose);
      }}
    >
      <div
        className={`border-0! flex  hover:bg-neutral200 px-2 py-2 rounded-[6px] ${
          content === "-" ? "h-[40px] items-center" : "h-[60px]"
        }`}
      >
        <div>
          <IconComponent className="w-6 h-6 [&_path]:fill-textTertiary" />
        </div>
        <div className="pl-2 flex flex-col justify-between min-w-0 flex-1">
          <span
            className="text14Medium text-textPrimary"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </span>
          {content !== "-" && (
            <span
              className="text12Medium text-textTertiary"
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {content}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function IdentitySearchItem({ address, name, onClose }) {
  const { identity, hasIdentity } = useIdentityInfo(address);

  const title = (
    <span className="flex">
      {hasIdentity && (
        <>
          <IdentityIcon identity={identity} />
          &nbsp;
        </>
      )}
      {name}
    </span>
  );

  return (
    <CommonSearchItem
      IconComponent={() => <AddressAvatar address={address} />}
      title={title}
      content={address}
      href={`/user/${address}`}
      onClose={onClose}
    />
  );
}

function MemberSearchItem({ address, rank, name, onClose }) {
  const { identity, hasIdentity } = useIdentityInfo(address);

  const title = (
    <div className="flex items-center gap-2">
      <span className="flex">
        {hasIdentity && (
          <>
            <IdentityIcon identity={identity} />
            &nbsp;
          </>
        )}
        {name}
      </span>
      <FellowshipTagByRank rank={rank} type="fellowship" />
    </div>
  );

  return (
    <CommonSearchItem
      IconComponent={() => <AddressAvatar address={address} />}
      title={title}
      content={address}
      href={`/user/${address}`}
      onClose={onClose}
    />
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
});

function SearchList({ data, isLoading, onClose, isMobile }) {
  return (
    <CommonList
      isMobile={isMobile}
      data={data}
      isLoading={isLoading}
      ItemBox={(props) => <SearchItem {...props} onClose={onClose} />}
      onClose={onClose}
    />
  );
}

export default memo(SearchList);
