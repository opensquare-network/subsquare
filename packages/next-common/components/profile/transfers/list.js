import dayjs from "dayjs";
import DataList from "next-common/components/dataList";
import AddressUser from "next-common/components/user/addressUser";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChain, useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { useState } from "react";
import Duration from "next-common/components/duration";

function EventID({ blockHeight, eventIndex }) {
  const chain = useChain();
  return (
    <a
      className="text-theme500"
      href={`https://${chain}.statescan.io/#/events/${blockHeight}-${eventIndex}`}
      target="_blank"
      rel="noreferrer"
    >
      {blockHeight}-{eventIndex}
    </a>
  );
}

function ExtrinsicID({ blockHeight, extrinsicIndex }) {
  const chain = useChain();

  if (extrinsicIndex === undefined) {
    return null;
  }

  return (
    <a
      className="text-theme500"
      href={`https://${chain}.statescan.io/#/extrinsics/${blockHeight}-${extrinsicIndex}`}
      target="_blank"
      rel="noreferrer"
    >
      {blockHeight}-{extrinsicIndex}
    </a>
  );
}

export default function TransferList({ items }) {
  const { symbol, decimals } = useChainSettings();
  const [timeType, setTimeType] = useState("time");

  const columns = [
    {
      name: "Event ID",
      style: { width: 130, textAlign: "left" },
    },
    {
      name: "Extrinsic ID",
      style: { width: 130, textAlign: "left" },
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
      style: { width: 230, textAlign: "left" },
    },
    {
      name: "From",
      style: { width: 176, textAlign: "left" },
    },
    {
      name: "To",
      style: { width: 176, textAlign: "left" },
    },
    {
      name: "Value",
      style: { width: 176, textAlign: "right" },
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
      <AddressUser key="from" add={item.from} noTooltip maxWidth={120} />,
      <AddressUser key="to" add={item.to} noTooltip maxWidth={120} />,
      <ValueDisplay
        key="value"
        value={toPrecision(item.balance, decimals)}
        symbol={symbol}
      />,
    ];

    row.key = eventId;

    return row;
  });

  return <DataList rows={rows} columns={columns} noDataText="No transfers" />;
}
