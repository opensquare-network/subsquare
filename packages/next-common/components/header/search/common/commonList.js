import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import DataList from "next-common/components/dataList";
import { ItemType } from "next-common/components/header/hooks/useSearchResults";

export const SearchType = {
  REFERENDA: "Referenda",
  DEMOCRACY_REFERENDA: "DemocracyReferenda",
  BOUNTIES: "Bounties",
  CHILD_BOUNTIES: "ChildBounties",
  IDENTITIES: "Identities",
  TREASURY_PROPOSALS: "TreasuryProposals",
  TREASURY_SPENDS: "TreasurySpends",
  TREASURY_TIPS: "TreasuryTips",
  FELLOWSHIP_REFERENDA: "FellowshipReferenda",
  FELLOWSHIP_TREASURY_SPENDS: "FellowshipTreasurySpends",
  FELLOWSHIP_MEMBERS: "FellowshipMembers",
  TREASURY_FUNDED_PROJECTS: "TreasuryFundedProjects",
};

export function getSearchItemPath(proposalType, index) {
  switch (proposalType) {
    case SearchType.REFERENDA:
      return `/referenda/${index}`;
    case SearchType.DEMOCRACY_REFERENDA:
      return `/democracy/referenda/${index}`;
    case SearchType.BOUNTIES:
      return `/treasury/bounties/${index}`;
    case SearchType.CHILD_BOUNTIES:
      return `/treasury/child-bounties/${index}`;
    case SearchType.TREASURY_PROPOSALS:
      return `/treasury/proposals/${index}`;
    case SearchType.TREASURY_SPENDS:
      return `/treasury/spends/${index}`;
    case SearchType.TREASURY_TIPS:
      return `/treasury/tips/${index}`;
    case SearchType.FELLOWSHIP_REFERENDA:
      return `/fellowship/referenda/${index}`;
    case SearchType.FELLOWSHIP_TREASURY_SPENDS:
      return `/fellowship/treasury/spends/${index}`;
    case SearchType.IDENTITIES:
      return `/user/${index}`;
    case SearchType.FELLOWSHIP_MEMBERS:
      return `/user/${index}`;
    default:
      return "/";
  }
}

export function getCategoryPath(proposalType) {
  switch (proposalType) {
    case SearchType.REFERENDA:
      return "/referenda";
    case SearchType.DEMOCRACY_REFERENDA:
      return "/democracy/referenda";
    case SearchType.BOUNTIES:
      return "/treasury/bounties";
    case SearchType.CHILD_BOUNTIES:
      return "/treasury/child-bounties";
    case SearchType.TREASURY_PROPOSALS:
      return "/treasury/proposals";
    case SearchType.TREASURY_SPENDS:
      return "/treasury/spends";
    case SearchType.TREASURY_TIPS:
      return "/treasury/tips";
    case SearchType.FELLOWSHIP_REFERENDA:
      return "/fellowship/referenda";
    case SearchType.FELLOWSHIP_TREASURY_SPENDS:
      return "/fellowship/treasury/spends";
    case SearchType.IDENTITIES:
      return "/";
    case SearchType.FELLOWSHIP_MEMBERS:
      return "/fellowship/members";
    case SearchType.TREASURY_FUNDED_PROJECTS:
      return "/treasury/status/projects";
    default:
      return "/";
  }
}

export function getCategoryOrSearchItemPath(item) {
  if (item.type === ItemType.CATEGORY) {
    return getCategoryPath(item.proposalType);
  }
  if (
    [SearchType.IDENTITIES, SearchType.FELLOWSHIP_MEMBERS].includes(
      item.proposalType,
    )
  ) {
    return getSearchItemPath(item.proposalType, item.address);
  }

  return getSearchItemPath(item.proposalType, item.index);
}

export function getCategoryName(proposalType) {
  switch (proposalType) {
    case SearchType.REFERENDA:
      return "Referenda";
    case SearchType.DEMOCRACY_REFERENDA:
      return "Democracy Referenda";
    case SearchType.BOUNTIES:
      return "Bounties";
    case SearchType.CHILD_BOUNTIES:
      return "Child Bounties";
    case SearchType.TREASURY_PROPOSALS:
      return "Treasury Proposals";
    case SearchType.TREASURY_SPENDS:
      return "Treasury Spends";
    case SearchType.TREASURY_TIPS:
      return "Treasury Tips";
    case SearchType.FELLOWSHIP_REFERENDA:
      return "Fellowship Referenda";
    case SearchType.FELLOWSHIP_TREASURY_SPENDS:
      return "Fellowship Treasury Spends";
    case SearchType.IDENTITIES:
      return "Identities";
    case SearchType.FELLOWSHIP_MEMBERS:
      return "Fellowship Members";
    case SearchType.TREASURY_FUNDED_PROJECTS:
      return "Treasury Funded Projects";
    default:
      return "Unknown";
  }
}

function CommonList({ data, isLoading, ItemBox, onClose, isMobile }) {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isHoverDisabled, setIsHoverDisabled] = useState(false);
  const listContainerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setIsHoverDisabled(true);
        setSelectedIndex((prev) => (prev + 1) % data?.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setIsHoverDisabled(true);
        setSelectedIndex((prev) => (prev - 1 + data?.length) % data?.length);
      } else if (e.key === "Enter" && selectedIndex !== -1) {
        const item = data[selectedIndex];

        const path = getCategoryOrSearchItemPath(item);
        if (path) {
          onClose?.();
          router.push(path);
          return;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    const handleMouseMove = () => {
      if (isHoverDisabled) {
        setIsHoverDisabled(false);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [data, selectedIndex, router, onClose, isHoverDisabled]);

  useEffect(() => {
    if (selectedIndex >= 0 && listContainerRef.current) {
      const selectedItem = listContainerRef.current.querySelector(
        `[data-index="${selectedIndex}"]`,
      );
      selectedItem?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  useEffect(() => {
    setSelectedIndex(-1); // Reset selection when data changes
  }, [data]);

  return (
    <div className="pt-2">
      <DataList
        ref={listContainerRef}
        columns={[]}
        rows={data}
        loading={isLoading}
        renderItem={(DataListItem, idx, rows) => (
          <div
            key={idx}
            data-index={idx}
            className={`${
              selectedIndex === idx
                ? "bg-neutral200 rounded-[6px] shadow-sm"
                : ""
            }`}
            onMouseEnter={() => {
              if (!isHoverDisabled) {
                setSelectedIndex(idx);
              }
            }}
            onFocus={() => setSelectedIndex(idx)}
          >
            <ItemBox row={rows[idx]} />
          </div>
        )}
        className={`max-h-[550px] overflow-auto ${
          isMobile ? "h-[calc(80vh-90px)]" : ""
        }`}
        contentClassName="border-0 divide-y-0 px-2"
        titleClassName="border-0 pb-0"
      />
    </div>
  );
}

export default React.memo(CommonList);
