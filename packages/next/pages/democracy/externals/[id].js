import DetailItem from "components/detailItem";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Business from "components/external/business";
import Metadata from "components/external/metadata";
import DemocracyExternalProposalCall from "components/external/call";
import Timeline from "components/external/timeline";
import useUniversalComments from "components/universalComments";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider } from "next-common/context/post";
import { hashEllipsis } from "next-common/utils";
import CheckUnFinalized from "components/external/checkUnFinalized";
import NonNullPost from "next-common/components/nonNullPost";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";
import DetailLayout from "next-common/components/layout/DetailLayout";
import DetailMultiTabs from "next-common/components/detail/detailMultiTabs";
import { fetchDetailComments } from "next-common/services/detail";

function DemocracyExternalContent({ detail, comments }) {
  const { CommentComponent, focusEditor } = useUniversalComments({
    detail,
    comments,
  });

  useSubscribePostDetail(detail?.externalProposalHash);

  const external = detail?.onchainData || {};
  const call = external?.preImage?.call;

  return (
    <>
      <DetailItem onReply={focusEditor} />
      <DetailMultiTabs
        call={
          call && (
            <DemocracyExternalProposalCall
              call={call}
              shorten={external.preImage.shorten}
              motionIndex={external.motionIndex}
              referendumIndex={external.referendumIndex}
            />
          )
        }
        business={<Business external={detail?.onchainData} />}
        metadata={<Metadata external={detail?.onchainData} />}
        timeline={<Timeline />}
      />
      {CommentComponent}
    </>
  );
}

export default withLoginUserRedux(({ id, detail, comments }) => {
  let breadcrumbItemName = "";
  let postContent = null;

  if (detail) {
    breadcrumbItemName = `#${hashEllipsis(detail?.externalProposalHash)}`;
    postContent = (
      <NonNullPost>
        <DemocracyExternalContent detail={detail} comments={comments} />
      </NonNullPost>
    );
  } else {
    const hash = id?.split("_").pop();
    breadcrumbItemName = `#${hashEllipsis(hash)}`;
    postContent = <CheckUnFinalized id={hash} />;
  }

  const desc = getMetaDesc(detail);

  const breadcrumbItems = [
    {
      content: "Democracy",
    },
    {
      content: "Externals",
      path: "/democracy/externals",
    },
    {
      content: breadcrumbItemName,
    },
  ];

  return (
    <PostProvider post={detail}>
      <DetailLayout
        seoInfo={{
          title: detail?.title,
          desc,
          ogImage: getBannerUrl(detail?.bannerCid),
        }}
        breadcrumbs={breadcrumbItems}
      >
        {postContent}
      </DetailLayout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { id } = context.query;

  const { result: detail } = await nextApi.fetch(`democracy/externals/${id}`);

  if (!detail) {
    return {
      props: {
        id,
        detail: null,
        comments: EmptyList,
      },
    };
  }

  const comments = await fetchDetailComments(
    `democracy/externals/${detail._id}/comments`,
    context,
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
