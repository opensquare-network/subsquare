import { OnChainReferendaProvider } from "next-common/context/onchainReferenda";
import { ReferendaPalletProvider } from "next-common/context/referenda/pallet";
import { usePageProps } from "next-common/context/page";
import { OnChainReferendaTracksProvider } from "next-common/context/referenda/tracks";
import useBucket, {
  BucketProvider,
} from "next-common/components/referenda/tracks/tracksStatus/useBucket";
import { useCommonPreparingBucketStatusProps } from "next-common/components/referenda/tracks/tracksStatus/preparingBucketStatus";
import { useCommonOngoingBucketStatusProps } from "next-common/components/referenda/tracks/tracksStatus/ongoingBucketStatus";
import { Arrow } from "next-common/components/referenda/tracks/tracksStatus/trackStatusItem";
import BucketStatusLayout from "next-common/components/referenda/tracks/tracksStatus/bucketStatusLayout";
import Link from "next-common/components/link";
import useGroupedReferendaInTrack from "./useGroupedReferendaInTrack";

function PreparingBucketStatus({ preparing, queueing }) {
  const { className, sections, name, tooltip, paddingItemsColor, counts } =
    useCommonPreparingBucketStatusProps({ preparing, queueing });
  const { component: bucket } = useBucket({
    sections,
    paddingItemsColor,
  });
  return (
    <BucketStatusLayout
      className={className}
      name={name}
      tooltip={tooltip}
      counts={counts}
      bucket={bucket}
    />
  );
}

function OngoingBucketStatus({ trackId, deciding, confirming }) {
  const { className, sections, capacity, name, tooltip, counts } =
    useCommonOngoingBucketStatusProps({ trackId, deciding, confirming });
  const { component: bucket } = useBucket({
    sections,
    capacity,
  });
  return (
    <BucketStatusLayout
      className={className}
      name={name}
      tooltip={tooltip}
      counts={counts}
      bucket={bucket}
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
      <div className="flex flex-col gap-[8px]">
        <span className="text-textTertiary text12Medium">Track Status</span>
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
