import { withLoginUser } from "next-common/lib";
import { ssrNextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Timeline from "components/childBounty/timeline";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import Metadata from "next-common/components/treasury/bounty/metadata";
import useUniversalComments from "components/universalComments";
import { getBannerUrl } from "next-common/utils/banner";
import Claim from "components/childBounty/claim";
import {
  PostProvider,
  useOnchainData,
  usePost,
} from "next-common/context/post";
import CheckUnFinalized from "components/childBounty/checkUnFinalized";
import NonNullPost from "next-common/components/nonNullPost";
import ChildBountyDetail from "next-common/components/detail/treasury/childBounty";
import useSubChildBounty from "next-common/hooks/treasury/useSubChildBounty";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import DetailLayout from "next-common/components/layout/DetailLayout";
import DetailMultiTabs from "next-common/components/detail/detailMultiTabs";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";

function ChildBountyContent({ comments }) {
  const post = usePost();
  const { parentBountyId, index } = useOnchainData();
  useSubChildBounty(parentBountyId, index);

  const { CommentComponent, focusEditor } = useUniversalComments({
    detail: post,
    comments,
  });

  useSubscribePostDetail(post?.index);

  return (
    <>
      <ChildBountyDetail onReply={focusEditor} />
      <Claim />
      <DetailMultiTabs
        metadata={<Metadata meta={post?.onchainData?.meta} />}
        timeline={<Timeline onchainData={post?.onchainData} />}
      />
      {CommentComponent}
    </>
  );
}

export default function ChildBountyPage({ id, detail, comments }) {
  let breadcrumbItemName = "";
  let postContent = null;

  if (detail) {
    breadcrumbItemName = `#${detail?.index}`;
    postContent = (
      <NonNullPost>
        <ChildBountyContent comments={comments} />
      </NonNullPost>
    );
  } else {
    breadcrumbItemName = `#${id}`;
    postContent = <CheckUnFinalized id={id} />;
  }

  const desc = getMetaDesc(detail);

  const showRightSidePanel = ["PendingPayout", "Claimed"].includes(
    detail?.onchainData?.state?.state,
  );

  const breadcrumbItems = [
    {
      content: "Treasury",
    },
    {
      content: "Child Bounties",
      path: "/treasury/child-bounties",
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
        hasSidebar={showRightSidePanel}
      >
        {postContent}
      </DetailLayout>
    </PostProvider>
  );
}

export const getServerSideProps = withLoginUser(async (context) => {
  const { id } = context.query;

  const { result: detail } = await ssrNextApi.fetch(
    `treasury/child-bounties/${id}`,
  );

  if (!detail) {
    return getNullDetailProps(id);
  }

  const comments = await fetchDetailComments(
    `treasury/child-bounties/${detail._id}/comments`,
    context,
  );
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      id,
      detail,
      comments: comments ?? EmptyList,

      ...tracksProps,
    },
  };
});
