import { useCallback, useState } from "react";
import { isNil } from "lodash-es";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import AddressUser from "next-common/components/user/addressUser";
import Pagination from "next-common/components/pagination/index";
import { defaultPageSize } from "next-common/utils/constants";
import useHolders from "./useHolders";
import { TableCard } from "./styled";
import { useDotUsdContext } from "./context";

// Matches the value style of the PSM instance panel (text14Medium on textPrimary).
const VALUE_CLASS = "text14Medium text-textPrimary";

// A `th` centres its content by default, so every column states its alignment. Rank and Balance
// are pinned, which leaves Holder all of the remaining width: the balances are formatted
// differently from page to page, and without pinned neighbours the columns would redistribute
// and the rows would shift sideways whenever the data changes.
const columns = [
  { name: "Rank", className: "text-left", style: { width: "72px" } },
  { name: "Holder", className: "text-left" },
  { name: "Balance", className: "text-right", style: { width: "160px" } },
];

function BalanceValue({ value, symbol, decimals }) {
  if (isNil(value)) {
    return <span className="text14Medium text-textTertiary">—</span>;
  }

  return (
    <ValueDisplay
      className={VALUE_CLASS}
      value={toPrecision(value, decimals, 2)}
      symbol={symbol}
    />
  );
}

export default function DotUsdHolders() {
  const { data, isLoading: isPsmLoading } = useDotUsdContext();
  const { index: assetId, symbol, decimals } = data?.internalAsset ?? {};
  // The page is local state: the pager is rendered in buttonMode below, so paging never puts a
  // `page` query param in the URL.
  const [page, setPage] = useState(1);

  const onPageChange = useCallback((event, nextPage) => {
    event.preventDefault();
    event.stopPropagation();
    setPage(nextPage);
  }, []);

  const {
    holders,
    total,
    page: loadedPage,
    isLoading,
  } = useHolders(assetId, page, defaultPageSize);

  // The rows of the previous page stay on screen while the next one loads, so the table keeps
  // its height and the page does not jump; the pager carries the loading state instead.
  const isFirstLoad = isPsmLoading || (isLoading && !holders.length);

  // Ranks follow the page the rows on screen came from, so they stay right while the next page
  // is still loading.
  const rows = holders.map((holder, index) => [
    <span key="rank" className="text14Medium text-textTertiary">
      {(loadedPage - 1) * defaultPageSize + index + 1}
    </span>,
    <AddressUser key="holder" add={holder.address} />,
    <BalanceValue
      key="balance"
      value={holder.balance}
      symbol={symbol}
      decimals={decimals}
    />,
  ]);

  return (
    <div>
      <TableCard
        columns={columns}
        rows={rows}
        items={holders}
        loading={isFirstLoad}
        noDataText="No dotUSD holders"
      />
      {total > 0 && (
        <Pagination
          page={page}
          pageSize={defaultPageSize}
          total={total}
          onPageChange={onPageChange}
          buttonMode
          loading={isLoading}
        />
      )}
    </div>
  );
}
