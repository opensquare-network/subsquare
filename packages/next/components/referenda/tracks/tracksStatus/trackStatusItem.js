import dynamic from "next/dynamic";
import { startCase } from "lodash-es";
import useReferendaTrackDetail from "next-common/hooks/referenda/useReferendaTrackDetail";
import PreparingBucketStatus from "./preparingBucketStatus";
import OngoingBucketStatus from "./ongoingBucketStatus";
import Link from "next/link";

const ArrowRight = dynamic(() => import("@osn/icons/subsquare/ArrowRight"));

function Arrow() {
  return (
    <div className="p-[2px] text-center">
      <div className="inline-flex items-center justify-center p-[2px] rounded-full bg-neutral200">
        <ArrowRight
          className="[&_path]:stroke-textTertiary"
          width={16}
          height={16}
        />
      </div>
    </div>
  );
}

function TrackName({ trackId }) {
  const { track: trackDetail } = useReferendaTrackDetail(trackId);
  const trackName = startCase(trackDetail?.name);

  return (
    <Link
      href={`/referenda/tracks/${trackId}`}
      className="cursor-pointer mb-[16px] text14Bold text-textPrimary"
    >
      [{trackId}] {trackName}
    </Link>
  );
}

export default function TrackStatusItem({
  trackId,
  preparing,
  queueing,
  deciding,
  confirming,
}) {
  return (
    <div className="flex flex-col p-[24px] border-b border-b-neutral300 last:border-b-0">
      <TrackName trackId={trackId} />
      <div className="flex gap-[16px] max-sm:flex-col max-sm:gap-[8px]">
        <PreparingBucketStatus
          className="sm:max-w-[300px] basis-[28%] shrink-0"
          preparing={preparing}
          queueing={queueing}
        />
        <Arrow />
        <OngoingBucketStatus
          className="grow"
          trackId={trackId}
          deciding={deciding}
          confirming={confirming}
        />
      </div>
    </div>
  );
}
