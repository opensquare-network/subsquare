import { useCallback, useState } from "react";
import { isNil } from "lodash-es";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import AddressUser from "next-common/components/user/addressUser";
import Pagination from "next-common/components/pagination";
import { MapDataList } from "next-common/components/dataList";
import { defaultPageSize } from "next-common/utils/constants";
import { useChain } from "next-common/context/chain";
import {
  TimeAgeCell,
  TimeAgeToggle,
  useTimeAge,
} from "next-common/components/timeAge";
import { getAssetMeta } from "../assetMetas";
import useSwaps from "./useSwaps";
import { buildSwapRecord } from "./swapRecords";

// Matches the value style of the PSM instance panel (text14Medium on textPrimary).
const VALUE_CLASS = "text14Medium text-textPrimary";
const EMPTY_CLASS = "text14Medium text-textTertiary";

function buildColumns({ isTime, onToggleTime, chain }) {
  return [
    {
      name: "Account",
      className: "text-left whitespace-nowrap",
      style: { width: "220px", minWidth: "220px" },
      render: (record) => <AddressUser add={record.address} maxWidth={160} />,
    },
    {
      name: <TimeAgeToggle isTime={isTime} onToggle={onToggleTime} />,
      className: "text-left whitespace-nowrap",
      style: { minWidth: "170px" },
      render: (record) => (
        <TimeAgeCell
          indexer={record.indexer}
          isTime={isTime}
          customDomain={`assethub-${chain}`}
        />
      ),
    },
    {
      name: "Paid",
      className: "text-right whitespace-nowrap",
      style: { width: "160px", minWidth: "160px" },
      render: (record) => (
        <Amount
          value={record.paidAmount}
          asset={getAssetMeta(record.paidAssetIndex)}
          index={record.paidAssetIndex}
        />
      ),
    },
    {
      name: "Received",
      className: "text-right whitespace-nowrap",
      style: { width: "200px", minWidth: "200px" },
      render: (record) => (
        <Amount
          value={record.receivedAmount}
          asset={getAssetMeta(record.receivedAssetIndex)}
          index={record.receivedAssetIndex}
        />
      ),
    },
    {
      name: "Fee",
      className: "text-right whitespace-nowrap",
      style: { width: "160px", minWidth: "160px" },
      render: (record) => (
        <Amount
          value={record.fee}
          asset={getAssetMeta(record.internalAssetIndex)}
          index={record.internalAssetIndex}
        />
      ),
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
  const [page, setPage] = useState(1);
  const { isTime, onToggle } = useTimeAge();
  const chain = useChain();

  const onPageChange = useCallback((event, nextPage) => {
    event.preventDefault();
    event.stopPropagation();
    setPage(nextPage);
  }, []);

  const columns = buildColumns({ isTime, onToggleTime: onToggle, chain });

  const { swaps, total, isLoading } = useSwaps(method, page, defaultPageSize);

  const records = swaps.map(buildSwapRecord);

  const isFirstLoad = isLoading && !swaps.length;

  return (
    <div>
      <MapDataList
        bordered
        columnsDef={columns}
        data={records}
        getRowKey={(record) =>
          `${record.indexer.blockHeight}-${record.indexer.eventIndex}`
        }
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
