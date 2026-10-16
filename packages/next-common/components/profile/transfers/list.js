import DataList from "next-common/components/dataList";
import AddressUser from "next-common/components/user/addressUser";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChain, useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { getStatescanDomain } from "next-common/utils/statescan";
import {
  TimeAgeCell,
  TimeAgeToggle,
  useTimeAge,
} from "next-common/components/timeAge";

function EventID({ blockHeight, eventIndex, statescanDomain }) {
  const chain = useChain();
  const domain = statescanDomain || getStatescanDomain(chain);

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

function ExtrinsicID({ blockHeight, extrinsicIndex, statescanDomain }) {
  const chain = useChain();
  const domain = statescanDomain || getStatescanDomain(chain);

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

export default function TransferList({ isLoading, items, statescanDomain }) {
  const { symbol, decimals } = useChainSettings();
  const chain = useChain();
  const { isTime, onToggle } = useTimeAge();
  const domain = statescanDomain || getStatescanDomain(chain);

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
      name: <TimeAgeToggle isTime={isTime} onToggle={onToggle} />,
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
      <EventID
        key="eventId"
        {...item.indexer}
        statescanDomain={statescanDomain}
      />,
      <ExtrinsicID
        key="eventId"
        {...item.indexer}
        statescanDomain={statescanDomain}
      />,
      <TimeAgeCell
        key="time"
        indexer={item.indexer}
        isTime={isTime}
        customDomain={domain}
      />,
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
