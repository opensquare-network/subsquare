import Tooltip from "next-common/components/tooltip";
import getStatusColor from "../common";
import { startCase } from "lodash-es";
import useReferendaTrackDetail from "next-common/hooks/referenda/useReferendaTrackDetail";
import BucketStatus from "./bucketStatus";

function StatusCounts({ counts, max }) {
  let content = 0;

  const tooltips = [];
  const numbers = [];
  let total = 0;
  for (const [status, count] of Object.entries(counts)) {
    total += count;
    if (count > 0) {
      tooltips.push(`${startCase(status)}: ${count}`);
      numbers.push(count);
    }
  }

  if (numbers.length > 0) {
    content = (
      <Tooltip
        content={
          <>
            <div>Capacity: {max}</div>
            {tooltips.map((item, i) => (
              <div key={i}>{item}</div>
            ))}
          </>
        }
      >
        {total}
        {numbers.length > 1 ? `(${numbers.join("·")})` : ""}
        <span className="text-textDisabled"> / {max}</span>
      </Tooltip>
    );
  }

  return <span className="text-textPrimary ml-[8px]">{content}</span>;
}

export default function OngoingBucketStatus({
  className,
  trackId,
  deciding,
  confirming,
}) {
  const trackDetail = useReferendaTrackDetail(trackId);

  const sections = [
    {
      referenda: deciding,
      color: getStatusColor("deciding"),
      status: "deciding",
    },
    {
      referenda: confirming,
      color: getStatusColor("confirming"),
      status: "confirming",
    },
  ];

  return (
    <BucketStatus
      className={className}
      sections={sections}
      maxSize={trackDetail.maxDeciding}
      name="Ongoing"
      tooltip="Including deciding and confirming status"
      counts={
        <StatusCounts
          max={trackDetail.maxDeciding}
          counts={{ deciding: deciding.length, confirming: confirming.length }}
        />
      }
    />
  );
}
