import { useMemo, useEffect } from "react";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { MapDataList } from "next-common/components/dataList";
import { isEmpty, isNil } from "lodash-es";
import useYearStatusColumnsDef from "../hooks/useYearStatusColumnsDef";
import normalizeTreasuryChildBountyListItem from "next-common/utils/viewfuncs/treasury/normalizeChildBountyListItem";
import normalizeTreasuryBountyListItem from "next-common/utils/viewfuncs/treasury/normalizeBountyListItem";
import normalizeTreasuryProposalListItem from "next-common/utils/viewfuncs/treasury/normalizeProposalListItem";
import normalizeTreasurySpendListItem from "next-common/utils/viewfuncs/treasury/normalizeTreasurySpendListItem";
import normalizeTipListItem from "next-common/utils/viewfuncs/treasury/normalizeTipListItem";

const pageSize = 10;

export const TYPES = {
  TIPS: "tips",
  BOUNTIES: "bounties",
  CHILD_BOUNTIES: "childBounties",
  PROPOSALS: "proposals",
  SPENDS: "spends",
};

const TYPES_MAP = {
  [TYPES.TIPS]: {
    getIndex: (tip) => ({
      displayIndex: tip.hash,
      requestIndex: tip.hash,
    }),
    apiPath: "/treasury/tips",
    normalizeItem: normalizeTipListItem,
  },
  [TYPES.BOUNTIES]: {
    getIndex: (bounty) => ({
      requestIndex: bounty.bountyIndex,
    }),
    apiPath: "/treasury/bounties",
    normalizeItem: normalizeTreasuryBountyListItem,
  },
  [TYPES.CHILD_BOUNTIES]: {
    getIndex: (childBounty) => {
      const { parentBountyId, index, blockHeight, hasSameParentAndIndex } =
        childBounty;
      const indexes = [parentBountyId, index];
      if (hasSameParentAndIndex) {
        indexes.push(blockHeight);
      }
      return {
        displayIndex: [parentBountyId, index].join("_"),
        requestIndex: indexes.join("_"),
      };
    },
    apiPath: "/treasury/child-bounties",
    normalizeItem: normalizeTreasuryChildBountyListItem,
  },
  [TYPES.PROPOSALS]: {
    getIndex: (proposal) => ({
      requestIndex: proposal.proposalIndex,
    }),
    apiPath: "/treasury/proposals",
    normalizeItem: normalizeTreasuryProposalListItem,
  },
  [TYPES.SPENDS]: {
    getIndex: (spend) => ({
      requestIndex: spend.index,
    }),
    apiPath: "/treasury/spends",
    normalizeItem: normalizeTreasurySpendListItem,
  },
};

export default function TreasuryItemsList({
  items = [],
  pageSize: customPageSize = pageSize,
  type,
}) {
  const typeFormat = useMemo(() => TYPES_MAP[type], [type]);

  if (isNil(typeFormat)) {
    return null;
  }

  return (
    <TreasuryItemsListImpl
      items={items}
      {...typeFormat}
      type={type}
      pageSize={customPageSize}
    />
  );
}

function TreasuryItemsListImpl({
  items = [],
  getIndex,
  apiPath,
  normalizeItem,
  type,
  pageSize: customPageSize = pageSize,
}) {
  const {
    page,
    component: pagination,
    setPage,
  } = usePaginationComponent(items.length, customPageSize, {
    buttonMode: true,
  });

  useEffect(() => {
    setPage(1);
  }, [items, setPage]);

  const sortedItems = useMemo(
    () => items?.sort((a, b) => b.fiatValueAtFinal - a.fiatValueAtFinal),
    [items],
  );

  const pagedItems = useMemo(
    () =>
      sortedItems?.slice((page - 1) * customPageSize, page * customPageSize),
    [sortedItems, page, customPageSize],
  );

  const columnsDef = useYearStatusColumnsDef({
    getIndex,
    apiPath,
    normalizeItem,
    type,
  });

  return (
    <>
      <MapDataList
        data={pagedItems}
        columnsDef={columnsDef}
        loading={isEmpty(pagedItems)}
      />
      {pagination}
    </>
  );
}
