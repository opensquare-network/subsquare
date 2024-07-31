import Tooltip from "next-common/components/tooltip";
import getStatusColor from "../common";
import { startCase } from "lodash-es";
import BucketStatus from "./bucketStatus";

function StatusCounts({ counts }) {
  let content = 0;

  const tooltips = [];
  const numbers = [];
  for (const [status, count] of Object.entries(counts)) {
    if (count > 0) {
      tooltips.push(`${startCase(status)}: ${count}`);
      numbers.push(count);
    }
  }

  if (numbers.length > 0) {
    content = (
      <Tooltip
        content={tooltips.map((item, i) => (
          <div key={i}>{item}</div>
        ))}
      >
        {numbers.join("·")}
      </Tooltip>
    );
  }

  return <span className="text-textPrimary ml-[8px]">{content}</span>;
}

export default function PreparingBucketStatus({
  className,
  preparing,
  queueing,
}) {
  const sections = [
    {
      referenda: preparing,
      color: getStatusColor("preparing"),
      status: "preparing",
    },
    {
      referenda: queueing,
      color: getStatusColor("queueing"),
      status: "queueing",
    },
  ];

  return (
    <BucketStatus
      className={className}
      sections={sections}
      name="Preparing"
      tooltip="Including preparing and queueing status"
      counts={
        <StatusCounts
          counts={{ preparing: preparing.length, queueing: queueing.length }}
        />
      }
    />
  );
}
