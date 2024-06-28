import { useOnchainData, usePost } from "next-common/context/post";
import Gov2Sidebar from "components/gov2/sidebar";
import Timeline from "components/gov2/timeline";
import Gov2ReferendumMetadata from "next-common/components/gov2/referendum/metadata";
import { useEffect } from "react";
import { unsetIssuance } from "next-common/store/reducers/gov2ReferendumSlice";
import { useDispatch } from "react-redux";
import SimaReferendaDetail from "next-common/sima/components/referenda/detail";
import useSubReferendumInfo from "next-common/hooks/referenda/useSubReferendumInfo";
import { useReferendumInfo } from "next-common/hooks/referenda/useReferendumInfo";
import { clearVotes } from "next-common/store/reducers/referenda/votes";
import DetailMultiTabs from "next-common/components/detail/detailMultiTabs";
import Gov2ReferendumCall from "next-common/components/gov2/referendum/call";
import Gov2ReferendaVotesBubble from "next-common/components/gov2/referendum/votesBubble";
import ProposalAddress from "next-common/components/statistics/referenda/proposalAddress";
import useFetchVotes from "next-common/utils/gov2/useFetchVotes";
import ContentWithComment from "next-common/sima/components/post/contentWithComment";

export default function SimaReferendumContent() {
  const post = usePost();

  const dispatch = useDispatch();
  useSubReferendumInfo();
  const info = useReferendumInfo();
  const onchainData = useOnchainData();
  useFetchVotes(onchainData);
  const proposal = onchainData?.proposal ?? {};

  useEffect(() => {
    return () => {
      dispatch(unsetIssuance());
      dispatch(clearVotes());
    };
  }, [dispatch]);

  return (
    <ContentWithComment>
      <SimaReferendaDetail />

      <Gov2Sidebar />

      <DetailMultiTabs
        call={proposal?.call && <Gov2ReferendumCall />}
        metadata={<Gov2ReferendumMetadata info={info} />}
        timeline={<Timeline trackInfo={post?.onchainData?.trackInfo} />}
        votesBubble={<Gov2ReferendaVotesBubble />}
        statistics={<ProposalAddress />}
      />
    </ContentWithComment>
  );
}
