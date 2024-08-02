import Tooltip from "next-common/components/tooltip";
import getStatusColor from "../common";
import { startCase } from "lodash-es";
import BucketStatusLayout from "./bucketStatusLayout";
import useBucketWithViewAllButton from "./useBucketWithViewAllButton";

function PreparingStatusCounts({ counts }) {
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

export function useCommonPreparingBucketStatusProps({ preparing, queueing }) {
  const sections = [
    {
      referenda: queueing,
      color: getStatusColor("queueing"),
      status: "queueing",
    },
    {
      referenda: preparing,
      color: getStatusColor("preparing"),
      status: "preparing",
    },
  ];

  return {
    className: "sm:max-w-[300px] basis-[28%] shrink-0",
    sections,
    name: "Preparing",
    tooltip: "Including preparing and queueing status",
    paddingItemsColor: "var(--neutral400)",
    counts: (
      <PreparingStatusCounts
        counts={{ preparing: preparing.length, queueing: queueing.length }}
      />
    ),
  };
}

export default function PreparingBucketStatus({ preparing, queueing }) {
  const { className, sections, name, tooltip, paddingItemsColor, counts } =
    useCommonPreparingBucketStatusProps({ preparing, queueing });
  const { bucket, viewAllBtn } = useBucketWithViewAllButton({
    sections,
    paddingItemsColor,
  });
  return (
    <BucketStatusLayout
      className={className}
      name={name}
      tooltip={tooltip}
      bucket={bucket}
      counts={counts}
      action={viewAllBtn}
    />
  );
}
