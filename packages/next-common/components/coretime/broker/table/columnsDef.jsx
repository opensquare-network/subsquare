import TaskColumn from "./taskColumn";
import TimeColumn from "./timeColumn";
import CoretimeBrokerTag from "next-common/components/tags/state/coretimeBroker";

const columnsDef = [
  {
    name: "Core",
    key: "core",
    className: "w-[120px] text-left",
    render: (item) => <div>#{item.coreIndex}</div>,
  },
  {
    name: "Task",
    key: "task",
    render: (item) => <TaskColumn item={item} />,
  },
  {
    name: "Start time",
    key: "startTime",
    render: (item) => <TimeColumn height={item.startRelayBlock} />,
  },
  {
    name: "End time",
    key: "endTime",
    render: (item) => (
      <TimeColumn type={item.occupancyType} height={item.endRelayBlock} />
    ),
  },
  {
    name: "Type",
    key: "type",
    className: "w-[180px] text-right",
    render: (item) => <CoretimeBrokerTag state={item.occupancyType} />,
  },
];

export default columnsDef;
