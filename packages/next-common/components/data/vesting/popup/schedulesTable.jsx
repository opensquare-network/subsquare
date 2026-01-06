import { MapDataList } from "next-common/components/dataList";
import { Balance } from "next-common/components/data/vesting/table/columns";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import Tooltip from "next-common/components/tooltip";
import { isNil } from "lodash-es";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";

function StartingBlock({ startingBlock }) {
  const latestHeight = useAhmLatestHeight();
  const content = Number(startingBlock)?.toLocaleString();

  if (isNil(latestHeight) || startingBlock > latestHeight) {
    return (
      <Tooltip content="Not started">
        <span className="text-textTertiary">{content}</span>
      </Tooltip>
    );
  }

  return <div className="text-textPrimary">{content}</div>;
}

const columns = [
  {
    name: "Total",
    style: { textAlign: "left", minWidth: "120px" },
    render: (item) => <Balance value={item.locked} />,
  },
  {
    name: "Per Block",
    style: { textAlign: "left", minWidth: "120px" },
    render: (item) => <Balance value={item.perBlock} />,
  },
  {
    name: "Starting Block",
    style: { textAlign: "right", minWidth: "100px" },
    render: (item) => <StartingBlock startingBlock={item?.startingBlock} />,
  },
  {
    name: "Unlockable",
    style: { textAlign: "right", minWidth: "120px" },
    render: (item) => <Balance value={item.unlockable} />,
  },
  {
    name: "In Lock",
    style: { textAlign: "right", minWidth: "120px" },
    render: (item) => <Balance value={item.lockedNow} />,
  },
];

export default function SchedulesTable({ schedules, loading = false }) {
  return (
    <ScrollerX>
      <MapDataList
        columnsDef={columns}
        data={schedules}
        loading={loading}
        noDataText="No schedules"
      />
    </ScrollerX>
  );
}
