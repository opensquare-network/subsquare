import {
  OnChainReferendaProvider,
  useOnChainReferendaContext,
} from "next-common/context/onchainReferenda";
import { ReferendaPalletProvider } from "next-common/context/referenda/pallet";
import { TrackStatusContent } from "next-common/components/referenda/tracks/tracksStatus/trackStatusItem";
import { getOngoingReferendaStatus } from "next-common/components/referenda/tracks/common";
import { useMemo } from "react";
import { usePageProps } from "next-common/context/page";
import { OnChainReferendaTracksProvider } from "next-common/context/referenda/tracks";
import { BucketProvider } from "next-common/components/referenda/tracks/tracksStatus/useBucket";
import {
  eachOngoingReferenda,
  QueueingReferenda,
} from "next-common/utils/referenda";

function groupOngoingReferendaInTrack(trackId, allReferenda) {
  const groups = {
    preparing: [],
    queueing: new QueueingReferenda(),
    deciding: [],
    confirming: [],
  };

  for (const [referendumIndex, ongoingReferenda] of eachOngoingReferenda(
    allReferenda,
  )) {
    const currTrackId = ongoingReferenda.track.toNumber();
    if (currTrackId !== trackId) {
      continue;
    }

    const status = getOngoingReferendaStatus(ongoingReferenda);
    if (status) {
      if (status === "queueing") {
        groups.queueing.addReferendum(referendumIndex, ongoingReferenda);
      } else {
        groups[status].push(referendumIndex);
      }
    }
  }

  return {
    ...groups,
    queueing: groups.queueing.toSortedReferendumIndexes(),
  };
}

function useGroupedReferendaInTrack(trackId) {
  const { referenda, isLoading } = useOnChainReferendaContext();

  const groups = useMemo(() => {
    if (isLoading) {
      return {
        preparing: [],
        queueing: [],
        deciding: [],
        confirming: [],
      };
    }
    return groupOngoingReferendaInTrack(trackId, referenda);
  }, [isLoading, referenda, trackId]);

  return {
    referenda: groups,
    isLoading,
  };
}

function MyTrackStatusItem() {
  const { period } = usePageProps();
  const trackId = period?.id;
  const { referenda, isLoading } = useGroupedReferendaInTrack(trackId);

  if (isLoading) {
    return null;
  }

  return (
    <div>
      <TrackStatusContent trackId={trackId} {...referenda} />
    </div>
  );
}

export default function TrackStatus() {
  return (
    <ReferendaPalletProvider pallet="referenda">
      <OnChainReferendaTracksProvider>
        <OnChainReferendaProvider>
          <BucketProvider>
            <MyTrackStatusItem />
          </BucketProvider>
        </OnChainReferendaProvider>
      </OnChainReferendaTracksProvider>
    </ReferendaPalletProvider>
  );
}
