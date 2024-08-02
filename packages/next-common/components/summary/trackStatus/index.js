import { OnChainReferendaProvider } from "next-common/context/onchainReferenda";
import { ReferendaPalletProvider } from "next-common/context/referenda/pallet";
import { usePageProps } from "next-common/context/page";
import { OnChainReferendaTracksProvider } from "next-common/context/referenda/tracks";
import useBucket, {
  BucketProvider,
} from "next-common/components/referenda/tracks/tracksStatus/useBucket";
import { CommonPreparingBucketStatus } from "next-common/components/referenda/tracks/tracksStatus/preparingBucketStatus";
import { CommonOngoingBucketStatus } from "next-common/components/referenda/tracks/tracksStatus/ongoingBucketStatus";
import { Arrow } from "next-common/components/referenda/tracks/tracksStatus/trackStatusItem";
import { BucketStatusLayout } from "next-common/components/referenda/tracks/tracksStatus/bucketStatus";
import Link from "next/link";
import useGroupedReferendaInTrack from "./useGroupedReferendaInTrack";

function PreparingBucketStatusLayout({
  className,
  sections,
  capacity,
  name,
  tooltip,
  counts,
  idleItemsColor,
  paddingItemsColor,
}) {
  const { component: bucket } = useBucket({
    sections,
    capacity,
    idleItemsColor,
    paddingItemsColor,
  });

  return (
    <BucketStatusLayout
      className={className}
      bucket={bucket}
      name={name}
      tooltip={tooltip}
      counts={counts}
    />
  );
}

function OngoingBucketStatusLayout({
  className,
  sections,
  capacity,
  name,
  tooltip,
  counts,
  idleItemsColor,
  paddingItemsColor,
}) {
  const { component: bucket } = useBucket({
    sections,
    capacity,
    idleItemsColor,
    paddingItemsColor,
  });

  return (
    <BucketStatusLayout
      className={className}
      bucket={bucket}
      name={name}
      tooltip={tooltip}
      counts={counts}
      action={
        <Link
          className="cursor-pointer text-theme500 text12Medium"
          href="/referenda/tracks"
        >
          View Track Status
        </Link>
      }
    />
  );
}

function PreparingBucketStatus({ preparing, queueing }) {
  return (
    <CommonPreparingBucketStatus
      preparing={preparing}
      queueing={queueing}
      LayoutComponent={PreparingBucketStatusLayout}
    />
  );
}

function OngoingBucketStatus({ trackId, deciding, confirming }) {
  return (
    <CommonOngoingBucketStatus
      trackId={trackId}
      deciding={deciding}
      confirming={confirming}
      LayoutComponent={OngoingBucketStatusLayout}
    />
  );
}

function TrackStatusItem() {
  const { period } = usePageProps();
  const trackId = period?.id;
  const { referenda, isLoading } = useGroupedReferendaInTrack(trackId);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <div className="border-t border-dashed border-neutral300 my-[16px]" />
      <div className="flex gap-[16px] max-sm:flex-col max-sm:gap-[8px]">
        <PreparingBucketStatus
          queueing={referenda.queueing}
          preparing={referenda.preparing}
        />
        <Arrow />
        <OngoingBucketStatus
          trackId={trackId}
          deciding={referenda.deciding}
          confirming={referenda.confirming}
        />
      </div>
    </>
  );
}

export default function TrackStatus() {
  return (
    <ReferendaPalletProvider pallet="referenda">
      <OnChainReferendaTracksProvider>
        <OnChainReferendaProvider>
          <BucketProvider>
            <TrackStatusItem />
          </BucketProvider>
        </OnChainReferendaProvider>
      </OnChainReferendaTracksProvider>
    </ReferendaPalletProvider>
  );
}
