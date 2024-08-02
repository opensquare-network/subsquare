import Tooltip from "next-common/components/tooltip";
import getStatusColor from "../common";
import { startCase } from "lodash-es";
import useReferendaTrackDetail from "next-common/hooks/referenda/useReferendaTrackDetail";
import BucketStatus from "./bucketStatus";

function OngoingStatusCounts({ counts, capacity }) {
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

export function CommonOngoingBucketStatus({
  trackId,
  deciding,
  confirming,
  LayoutComponent,
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
    <LayoutComponent
      className="grow"
      sections={sections}
      capacity={trackDetail?.maxDeciding}
      name="Ongoing"
      tooltip="Including deciding and confirming status"
      counts={
        <OngoingStatusCounts
          capacity={trackDetail?.maxDeciding}
          counts={{ deciding: deciding.length, confirming: confirming.length }}
        />
      }
    />
  );
}

export default function OngoingBucketStatus({ trackId, deciding, confirming }) {
  return (
    <CommonOngoingBucketStatus
      trackId={trackId}
      deciding={deciding}
      confirming={confirming}
      LayoutComponent={BucketStatus}
    />
  );
}
