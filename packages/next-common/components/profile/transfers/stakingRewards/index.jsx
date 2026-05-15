import { useEffect, useState } from "react";
import { MapDataList } from "next-common/components/dataList";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { defaultPageSize } from "next-common/utils/constants";
import { useChain, useChainSettings } from "next-common/context/chain";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import AddressUser from "next-common/components/user/addressUser";
import dayjs from "dayjs";
import Duration from "next-common/components/duration";
import { getStatescanDomain } from "next-common/utils/statescan";
import useStakingRewards from "./useStakingRewards";

function DestCell({ dest, who, bonded }) {
  if (!dest) {
    return <span className="text-textTertiary">-</span>;
  }

  let account = null;
  if (dest.account) {
    account = dest.account;
  } else if ("staked" in dest || "stash" in dest) {
    account = who;
  } else if ("controller" in dest) {
    account = bonded;
  }

  if (!account) {
    return <span className="text-textTertiary">-</span>;
  }

  return <AddressUser add={account} />;
}

function useColumnsDef() {
  const { symbol, decimals } = useChainSettings();
  const chain = useChain();
  const [isTime, setIsTime] = useState(true);
  const domain = getStatescanDomain(chain);

  return [
    {
      name: "Event ID",
      style: { textAlign: "left", width: "120px", maxWidth: "120px" },
      render: (item) => (
        <a
          key="eventId"
          className="text-theme500"
          href={`https://${domain}.statescan.io/#/events/${item.indexer.blockHeight}-${item.indexer.eventIndex}`}
          target="_blank"
          rel="noreferrer"
        >
          {item.indexer.blockHeight}-{item.indexer.eventIndex}
        </a>
      ),
    },
    {
      name: "Extrinsic ID",
      style: { textAlign: "left", width: "120px", maxWidth: "120px" },
      render: (item) =>
        item.indexer.extrinsicIndex !== undefined ? (
          <a
            key="extrinsicId"
            className="text-theme500"
            href={`https://${domain}.statescan.io/#/extrinsics/${item.indexer.blockHeight}-${item.indexer.extrinsicIndex}`}
            target="_blank"
            rel="noreferrer"
          >
            {item.indexer.blockHeight}-{item.indexer.extrinsicIndex}
          </a>
        ) : null,
    },
    {
      name: (
        <button className="text-theme500" onClick={() => setIsTime((v) => !v)}>
          {isTime ? "Time" : "Age"}
        </button>
      ),
      style: { textAlign: "left", width: "200px", minWidth: "200px" },
      render: (item) =>
        isTime ? (
          <span key="time" className="text-textSecondary">
            {dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss")}
          </span>
        ) : (
          <Duration key="time" time={item.indexer.blockTime} />
        ),
    },

    {
      name: "Dest",
      style: { textAlign: "left", minWidth: "212px" },
      render: (item) => (
        <DestCell
          key="dest"
          dest={item.dest}
          who={item.who}
          bonded={item.bonded}
        />
      ),
    },
    {
      name: "Validator",
      style: { textAlign: "left", minWidth: "212px" },
      render: (item) =>
        item.validator ? (
          <AddressUser key="validator" add={item.validator} />
        ) : (
          <span key="validator" className="text-textTertiary">
            -
          </span>
        ),
    },
    {
      name: "Amount",
      style: { textAlign: "right", width: "160px", minWidth: "160px" },
      render: (item) => (
        <span key="amount" className="text14Medium text-textPrimary">
          <ValueDisplay
            value={toPrecision(item.amount, decimals)}
            symbol={symbol}
          />
        </span>
      ),
    },
  ];
}

export default function StakingRewardsList({ address, onTotalChange }) {
  const [totalCount, setTotalCount] = useState(0);
  const { page, component: pageComponent } = usePaginationComponent(
    totalCount,
    defaultPageSize,
  );

  const { list, total, loading } = useStakingRewards(address, page - 1);

  useEffect(() => {
    onTotalChange?.(loading ? null : total ?? 0);
  }, [total, loading, onTotalChange]);

  useEffect(() => {
    if (!loading && total) {
      setTotalCount(total);
    }
  }, [total, loading]);

  const columnsDef = useColumnsDef();

  return (
    <div>
      <MapDataList
        columnsDef={columnsDef}
        data={list}
        loading={loading}
        noDataText="No staking rewards"
      />
      {pageComponent}
    </div>
  );
}
