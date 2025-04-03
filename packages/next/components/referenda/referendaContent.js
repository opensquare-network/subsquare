import { useOnchainData, usePost } from "next-common/context/post";
import Gov2Sidebar from "components/gov2/sidebar";
import { useEffect } from "react";
import { unsetIssuance } from "next-common/store/reducers/gov2ReferendumSlice";
import { useDispatch } from "react-redux";
import ReferendaDetail from "next-common/components/detail/referenda";
import useSubReferendumInfo from "next-common/hooks/referenda/useSubReferendumInfo";
import { useReferendumInfo } from "next-common/hooks/referenda/useReferendumInfo";
import { clearVotes } from "next-common/store/reducers/referenda/votes";
import DetailMultiTabs from "next-common/components/detail/detailMultiTabs";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import MaybeSimaContent from "next-common/components/detail/maybeSimaContent";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import ReferendumCallProvider from "next-common/context/referenda/call";
import useReferendumDetail from "next-common/hooks/referenda/useReferendumDetail";

const Gov2ReferendumCall = dynamicClientOnly(() =>
  import("next-common/components/gov2/referendum/call"),
);
const ProposalAddress = dynamicClientOnly(() =>
  import("next-common/components/statistics/referenda/proposalAddress"),
);
const Gov2ReferendumMetadata = dynamicClientOnly(() =>
  import("next-common/components/gov2/referendum/metadata"),
);
const Timeline = dynamicClientOnly(() => import("components/gov2/timeline"));
const Gov2ReferendaVotesBubble = dynamicClientOnly(() =>
  import("next-common/components/gov2/referendum/votesBubble"),
);
const ReferendumReport = dynamicClientOnly(() => import("../referenda/report"));
export function ReferendumDetailMultiTabs() {
  const post = usePost();
  const info = useReferendumInfo();
  const onchainData = useOnchainData();
  const proposal = onchainData?.proposal ?? {};
  const referendumDetailForOGTrack = useReferendumDetail();

  return (
    <DetailMultiTabs
      call={
        proposal?.call && (
          <ReferendumCallProvider>
            <Gov2ReferendumCall />
          </ReferendumCallProvider>
        )
      }
      metadata={<Gov2ReferendumMetadata info={info} />}
      timeline={<Timeline trackInfo={post?.onchainData?.trackInfo} />}
      votesBubble={<Gov2ReferendaVotesBubble />}
      statistics={<ProposalAddress />}
      report={
        referendumDetailForOGTrack.detail && (
          <ReferendumReport detail={referendumDetailForOGTrack.detail} />
        )
      }
    />
  );
}

export function ReferendumContent() {
  const dispatch = useDispatch();
  useSubReferendumInfo();
  // const onchainData = useOnchainData();
  // useFetchVotes(onchainData);

  useEffect(() => {
    return () => {
      dispatch(unsetIssuance());
      dispatch(clearVotes());
    };
  }, [dispatch]);

  return (
    <MaybeSimaContent>
      <ContentWithComment>
        <ReferendaDetail />
        <Gov2Sidebar />
        <ReferendumDetailMultiTabs />
      </ContentWithComment>
    </MaybeSimaContent>
  );
}
