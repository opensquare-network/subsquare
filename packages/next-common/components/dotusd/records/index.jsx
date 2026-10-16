import { useCallback, useState } from "react";
import { isNil } from "lodash-es";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import AddressUser from "next-common/components/user/addressUser";
import Pagination from "next-common/components/pagination";
import { defaultPageSize } from "next-common/utils/constants";
import { useChain } from "next-common/context/chain";
import {
  TimeAgeCell,
  TimeAgeToggle,
  useTimeAge,
} from "next-common/components/timeAge";
import { TableCard } from "../styled";
import { getAssetMeta } from "../assetMetas";
import useSwaps from "./useSwaps";
import { buildSwapRecord } from "./swapRecords";

// Matches the value style of the PSM instance panel (text14Medium on textPrimary).
const VALUE_CLASS = "text14Medium text-textPrimary";
const EMPTY_CLASS = "text14Medium text-textTertiary";

// A `th` centres its content by default, so every column states its alignment. The account
// and the amounts are pinned, which leaves the time all of the remaining width; its
// `minWidth` only reserves what a `YYYY-MM-DD HH:mm:ss` needs, so the time never breaks.
// The time column is toggled from its header, as the other tables of the site do, so the
// column keeps its place and only its content swaps between the two readings.
function buildColumns({ isTime, onToggleTime }) {
  return [
    {
      name: "Account",
      className: "text-left whitespace-nowrap",
      style: { width: "220px", minWidth: "220px" },
    },
    {
      name: <TimeAgeToggle isTime={isTime} onToggle={onToggleTime} />,
      className: "text-left whitespace-nowrap",
      style: { minWidth: "170px" },
    },
    {
      name: "Paid",
      className: "text-right whitespace-nowrap",
      style: { width: "160px", minWidth: "160px" },
    },
    {
      name: "Received",
      className: "text-right whitespace-nowrap",
      style: { width: "200px", minWidth: "200px" },
    },
    {
      name: "Fee",
      className: "text-right whitespace-nowrap",
      style: { width: "160px", minWidth: "160px" },
    },
  ];
}

function Amount({ value, asset, index }) {
  if (isNil(value)) {
    return <span className={EMPTY_CLASS}>—</span>;
  }

  if (!asset?.symbol || isNil(asset?.decimals)) {
    return (
      <ValueDisplay
        className={VALUE_CLASS}
        value={value.toString()}
        symbol={`#${index}`}
      />
    );
  }

  return (
    <ValueDisplay
      className={VALUE_CLASS}
      value={toPrecision(value, asset.decimals)}
      symbol={asset.symbol}
    />
  );
}

export default function DotUsdSwapRecords({ method, noDataText }) {
  // The page is local state: the rows are read a page at a time and the pager is rendered in
  // buttonMode, so paging never puts a `page` query param in the URL.
  const [page, setPage] = useState(1);
  // The time column reads either as the moment of the swap or as how long ago it was.
  const { isTime, onToggle } = useTimeAge();
  const chain = useChain();

  const onPageChange = useCallback((event, nextPage) => {
    event.preventDefault();
    event.stopPropagation();
    setPage(nextPage);
  }, []);

  const columns = buildColumns({ isTime, onToggleTime: onToggle });

  const { swaps, total, isLoading } = useSwaps(method, page, defaultPageSize);

  // The rows of the previous page stay on screen while the next one loads, so the table keeps
  // its height and the page does not jump; the pager carries the loading state instead.
  const isFirstLoad = isLoading && !swaps.length;

  const rows = swaps.map((swap) => {
    const record = buildSwapRecord(swap);
    const internalAsset = getAssetMeta(record.internalAssetIndex);

    return [
      // The account column is pinned, so a long identity name is truncated into a tooltip
      // rather than widening the column.
      <AddressUser key="account" add={record.address} maxWidth={160} />,
      <TimeAgeCell
        key="time"
        indexer={record.indexer}
        isTime={isTime}
        customDomain={`assethub-${chain}`}
      />,
      <Amount
        key="paid"
        value={record.paidAmount}
        asset={getAssetMeta(record.paidAssetIndex)}
        index={record.paidAssetIndex}
      />,
      <Amount
        key="received"
        value={record.receivedAmount}
        asset={getAssetMeta(record.receivedAssetIndex)}
        index={record.receivedAssetIndex}
      />,
      <Amount
        key="fee"
        value={record.fee}
        asset={internalAsset}
        index={record.internalAssetIndex}
      />,
    ];
  });

  return (
    <div>
      <TableCard
        columns={columns}
        rows={rows}
        items={swaps}
        loading={isFirstLoad}
        noDataText={noDataText}
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
