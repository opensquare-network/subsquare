import dayjs from "dayjs";
import DataList from "next-common/components/dataList";
import AddressUser from "next-common/components/user/addressUser";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChain, useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { useState } from "react";
import Duration from "next-common/components/duration";
import { getStatescanDomain } from "next-common/utils/statescan";

function EventID({ blockHeight, eventIndex }) {
  const chain = useChain();
  const domain = getStatescanDomain(chain);

  return (
    <a
      className="text-theme500"
      href={`https://${domain}.statescan.io/#/events/${blockHeight}-${eventIndex}`}
      target="_blank"
      rel="noreferrer"
    >
      {blockHeight}-{eventIndex}
    </a>
  );
}

function ExtrinsicID({ blockHeight, extrinsicIndex }) {
  const chain = useChain();
  const domain = getStatescanDomain(chain);

  if (extrinsicIndex === undefined) {
    return null;
  }

  return (
    <a
      className="text-theme500"
      href={`https://${domain}.statescan.io/#/extrinsics/${blockHeight}-${extrinsicIndex}`}
      target="_blank"
      rel="noreferrer"
    >
      {blockHeight}-{extrinsicIndex}
    </a>
  );
}

export default function TransferList({ isLoading, items }) {
  const { symbol, decimals } = useChainSettings();
  const [timeType, setTimeType] = useState("time");

  const columns = [
    {
      name: "Event ID",
      style: { width: 120, maxWidth: 120, textAlign: "left" },
    },
    {
      name: "Extrinsic ID",
      style: { width: 120, maxWidth: 120, textAlign: "left" },
    },
    {
      name: (
        <span
          className="cursor-pointer text-theme500 capitalize"
          onClick={() => {
            setTimeType(timeType === "time" ? "age" : "time");
          }}
        >
          {timeType}
        </span>
      ),
      style: { width: 200, minWidth: 200, textAlign: "left" },
    },
    {
      name: "From",
      style: { width: 276, minWidth: 276, textAlign: "left" },
    },
    {
      name: "To",
      style: { width: 276, minWidth: 276, textAlign: "left" },
    },
    {
      name: "Value",
      style: { textAlign: "right" },
    },
  ];

  const rows = (items || []).map((item) => {
    const eventId = `${item.indexer.blockHeight}-${item.indexer.eventIndex}`;

    const row = [
      <EventID key="eventId" {...item.indexer} />,
      <ExtrinsicID key="eventId" {...item.indexer} />,
      timeType === "time" ? (
        dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss")
      ) : (
        <Duration key="time" time={item.indexer.blockTime} />
      ),
      <AddressUser key="from" add={item.from} />,
      <AddressUser key="to" add={item.to} />,
      <ValueDisplay
        key="value"
        value={toPrecision(item.balance, decimals)}
        symbol={symbol}
      />,
    ];

    row.key = eventId;

    return row;
  });

  return (
    <DataList
      loading={isLoading}
      rows={rows}
      columns={columns}
      noDataText="No transfers"
    />
  );
}
