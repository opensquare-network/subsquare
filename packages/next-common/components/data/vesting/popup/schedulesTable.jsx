import { MapDataList } from "next-common/components/dataList";
import { Balance } from "next-common/components/data/vesting/table/columns";
import ScrollerX from "next-common/components/styled/containers/scrollerX";

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
    render: (item) => (
      <span className="text-textSecondary">
        {Number(item?.startingBlock)?.toLocaleString()}
      </span>
    ),
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

export default function SchedulesTable({ schedules }) {
  return (
    <ScrollerX>
      <MapDataList
        columnsDef={columns}
        data={schedules}
        loading={false}
        noDataText="No schedules"
        contentClassName="max-h-[212px] overflow-y-scroll scrollbar-pretty"
      />
    </ScrollerX>
  );
}
