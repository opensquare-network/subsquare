import TaskColumn from "../table/taskColumn";
import TimeColumn from "../table/timeColumn";
import CoretimeCoresTag from "next-common/components/tags/state/coretimeCores";
import { useMemo } from "react";
import { useSwitchTime } from "../context/switchTimeContext";

function TimeHeaderButton({ name = "Time", timeName = "Age" }) {
  const { isTime, toggleIsTime } = useSwitchTime();
  return (
    <button className="text-theme500" onClick={toggleIsTime}>
      {isTime ? name : timeName}
    </button>
  );
}

export function useTimeColumnsDef() {
  return useMemo(
    () => [
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
        name: <TimeHeaderButton name="Start time" timeName="Start age" />,
        key: "startTime",
        render: (item) => <TimeColumn height={item.startRelayBlock} />,
      },
      {
        name: <TimeHeaderButton name="End time" timeName="End age" />,
        key: "endTime",
        render: (item) => (
          <TimeColumn type={item.occupancyType} height={item.endRelayBlock} />
        ),
      },
      {
        name: "Type",
        key: "type",
        className: "w-[180px] text-right",
        render: (item) => <CoretimeCoresTag state={item.occupancyType} />,
      },
    ],
    [],
  );
}
