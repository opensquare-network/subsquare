import { MapDataList } from "next-common/components/dataList";
import TaskColumn from "../cores/table/taskColumn";
import { formatRegionShare } from "../regions/utils";

const columnsDef = [
  {
    name: "Task",
    key: "task",
    render: ({ taskId }) => <TaskColumn item={{ isTask: true, taskId }} />,
  },
  {
    name: "Share",
    key: "share",
    className: "w-[100px] text-right",
    render: ({ percentage }) => `${percentage}%`,
  },
];

export default function RenewalTasks({ renewal }) {
  const workload =
    renewal?.completion?.type === "Complete" ? renewal.completion.value : [];
  const tasks = formatTasks(workload);

  return (
    <MapDataList
      columnsDef={columnsDef}
      data={tasks}
      getRowKey={({ taskId }) => taskId}
      noDataText="No tasks"
    />
  );
}

function formatTasks(workload) {
  const tasks = new Map();

  for (const { assignment, mask } of workload) {
    if (assignment?.type !== "Task") {
      continue;
    }

    const taskId = assignment.value;
    const { parts, totalParts } = formatRegionShare(mask);
    const task = tasks.get(taskId) ?? { taskId, parts: 0, totalParts };

    task.parts += parts;
    tasks.set(taskId, task);
  }

  return Array.from(tasks.values()).map(({ taskId, parts, totalParts }) => ({
    taskId,
    percentage: Number.parseFloat(((parts / totalParts) * 100).toFixed(2)),
  }));
}
