import Tooltip from "next-common/components/tooltip";
import getStatusColor from "../common";
import { startCase } from "lodash-es";
import useReferendaTrackDetail from "next-common/hooks/referenda/useReferendaTrackDetail";
import BucketStatus from "./bucketStatus";

function StatusCounts({ counts, capacity }) {
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

  const content = (
    <Tooltip
      content={
        <>
          <div>Capacity: {capacity}</div>
          {tooltips.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </>
      }
    >
      {total}
      {numbers.length > 1 ? `(${numbers.join("·")})` : ""}
      <span className="text-textDisabled"> / {capacity}</span>
    </Tooltip>
  );

  return <span className="text-textPrimary ml-[8px]">{content}</span>;
}

export default function OngoingBucketStatus({
  className,
  trackId,
  deciding,
  confirming,
}) {
  const { track: trackDetail } = useReferendaTrackDetail(trackId);

  const sections = [
    {
      referenda: confirming,
      color: getStatusColor("confirming"),
      status: "confirming",
    },
    {
      referenda: deciding,
      color: getStatusColor("deciding"),
      status: "deciding",
    },
  ];

  return (
    <BucketStatus
      className={className}
      sections={sections}
      capacity={trackDetail?.maxDeciding}
      name="Ongoing"
      tooltip="Including deciding and confirming status"
      counts={
        <StatusCounts
          capacity={trackDetail?.maxDeciding}
          counts={{ deciding: deciding.length, confirming: confirming.length }}
        />
      }
    />
  );
}
