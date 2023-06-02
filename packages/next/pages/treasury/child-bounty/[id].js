import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Timeline from "components/childBounty/timeline";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import Metadata from "next-common/components/treasury/bounty/metadata";
import useUniversalComments from "components/universalComments";
import { getBannerUrl } from "next-common/utils/banner";
import DetailWithRightLayout from "next-common/components/layout/detailWithRightLayout";
import Claim from "components/childBounty/claim";
import { PostProvider, useOnchainData, usePost } from "next-common/context/post";
import DetailLayout from "next-common/components/layout/DetailLayout";
import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import Breadcrumb from "next-common/components/_Breadcrumb";
import CheckUnFinalized from "components/childBounty/checkUnFinalized";
import NonNullPost from "next-common/components/nonNullPost";
import ChildBountyDetail from "next-common/components/detail/treasury/childBounty";
import useSubChildBounty from "next-common/hooks/treasury/useSubChildBounty";

function ChildBountyContent({ comments }) {
  const post = usePost();
  const { parentBountyId, index } = useOnchainData();
  useSubChildBounty(parentBountyId, index);

  const { CommentComponent, focusEditor } = useUniversalComments({
    detail: post,
    comments,
  });

  return (
    <>
      <ChildBountyDetail onReply={focusEditor} />
      <Claim />
      <Metadata meta={post?.onchainData?.meta} />
      <Timeline onchainData={post?.onchainData} />
      {CommentComponent}
    </>
  );
}

export default withLoginUserRedux(({ id, detail, comments }) => {
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
    detail?.onchainData?.state?.state
  );

  const Layout = showRightSidePanel ? DetailWithRightLayout : DetailLayout;

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
      <Layout
        seoInfo={{
          title: detail?.title,
          desc,
          ogImage: getBannerUrl(detail?.bannerCid),
        }}
      >
        <BreadcrumbWrapper>
          <Breadcrumb items={breadcrumbItems} />
        </BreadcrumbWrapper>

        {postContent}
      </Layout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { id, page, page_size } = context.query;
  const pageSize = Math.min(page_size ?? 50, 100);

  const { result: detail } = await ssrNextApi.fetch(
    `treasury/child-bounties/${id}`
  );

  if (!detail) {
    return {
      props: {
        id,
        detail: null,
        comments: EmptyList,
      },
    };
  }

  const { result: comments } = await ssrNextApi.fetch(
    `treasury/child-bounties/${detail._id}/comments`,
    {
      page: page ?? "last",
      pageSize,
    }
  );

  return {
    props: {
      id,
      detail,
      comments: comments ?? EmptyList,
    },
  };
});
