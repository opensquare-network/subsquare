import DetailItem from "components/detailItem";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Timeline from "components/treasuryProposal/timeline";
import Metadata from "next-common/components/treasury/proposal/metadata";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import useUniversalComments from "components/universalComments";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider } from "next-common/context/post";
import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import Breadcrumb from "next-common/components/_Breadcrumb";
import CheckUnFinalized from "next-common/components/treasury/proposal/checkUnFinalized";

function TreasuryProposalContent({ detail, comments }) {
  const { CommentComponent, focusEditor } = useUniversalComments({
    detail,
    comments,
  });

  return (
    <>
      <DetailItem onReply={focusEditor} />
      <Metadata treasuryProposal={detail?.onchainData} />
      <Timeline treasuryProposal={detail?.onchainData} />
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
      <TreasuryProposalContent detail={detail} comments={comments} />
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

  return (
    <PostProvider post={detail}>
      <DetailLayout
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
