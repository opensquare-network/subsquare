import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Metadata from "next-common/components/treasury/proposal/metadata";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import useUniversalComments from "components/universalComments";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider } from "next-common/context/post";
import CheckUnFinalized from "next-common/components/treasury/proposal/checkUnFinalized";
import NonNullPost from "next-common/components/nonNullPost";
import TreasuryProposalDetail from "next-common/components/detail/treasury/proposal";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import DetailLayout from "next-common/components/layout/DetailLayout";
import DetailMultiTabs from "next-common/components/detail/detailMultiTabs";
import useTreasuryTimelineData from "../../../components/treasuryProposal/useTimelineData";
import Timeline from "next-common/components/timeline";

function TreasuryProposalContent({ detail, comments }) {
  const { CommentComponent, focusEditor } = useUniversalComments({
    detail,
    comments,
  });

  useSubscribePostDetail(detail?.proposalIndex);
  const timelineData = useTreasuryTimelineData(detail?.onchainData);

  return (
    <>
      <TreasuryProposalDetail onReply={focusEditor} />
      <DetailMultiTabs
        metadata={<Metadata treasuryProposal={detail?.onchainData} />}
        timeline={<Timeline data={timelineData} indent={false} />}
        timelineCount={timelineData.length}
      />
      {CommentComponent}
    </>
  );
}

export default withLoginUserRedux(({ id, detail, comments }) => {
  let breadcrumbItemName = "";
  let postContent = null;

  if (detail) {
    breadcrumbItemName = `#${detail?.proposalIndex}`;
    postContent = (
      <NonNullPost>
        <TreasuryProposalContent detail={detail} comments={comments} />
      </NonNullPost>
    );
  } else {
    breadcrumbItemName = `#${id}`;
    postContent = <CheckUnFinalized id={id} />;
  }

  const breadcrumbItems = [
    {
      content: "Treasury",
    },
    {
      content: "Proposals",
      path: "/treasury/proposals",
    },
    {
      content: breadcrumbItemName,
    },
  ];

  const desc = getMetaDesc(detail);

  const seoInfo = {
    title: detail?.title,
    desc,
    ogImage: getBannerUrl(detail?.bannerCid),
  };

  return (
    <PostProvider post={detail}>
      <DetailLayout seoInfo={seoInfo} breadcrumbs={breadcrumbItems}>
        {postContent}
      </DetailLayout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { id, page, page_size } = context.query;
  const pageSize = Math.min(page_size ?? 50, 100);

  const { result: detail } = await nextApi.fetch(`treasury/proposals/${id}`);

  if (!detail) {
    return {
      props: {
        id,
        detail: null,
        comments: EmptyList,
      },
    };
  }

  const { result: comments } = await nextApi.fetch(
    `treasury/proposals/${detail._id}/comments`,
    {
      page: page ?? "last",
      pageSize,
    },
  );

  const [{ result: tracks }, { result: fellowshipTracks }] = await Promise.all([
    nextApi.fetch(gov2TracksApi),
    nextApi.fetch(fellowshipTracksApi),
  ]);

  return {
    props: {
      id,
      detail,
      comments: comments ?? EmptyList,

      tracks,
      fellowshipTracks,
    },
  };
});
