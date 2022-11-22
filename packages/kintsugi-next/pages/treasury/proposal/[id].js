import DetailItem from "components/detailItem";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Timeline from "components/treasuryProposal/timeline";
import Metadata from "next-common/components/treasury/proposal/metadata";
import { to404 } from "next-common/utils/serverSideUtil";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import useCommentComponent from "next-common/components/useCommentComponent";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider } from "next-common/context/post";
import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import Breadcrumb from "next-common/components/_Breadcrumb";

export default withLoginUserRedux(({ detail, comments }) => {
  const { CommentComponent, focusEditor } = useCommentComponent({
    detail,
    comments,
    type: detailPageCategory.TREASURY_PROPOSAL,
  });

  const desc = getMetaDesc(detail);

  const breadcrumbItems = [
    {
      content: "Treasury",
    },
    {
      content: "Proposals",
      path: "/treasury/proposals",
    },
    {
      content: `#${detail?.proposalIndex}`,
    },
  ];

  return (
    <PostProvider post={detail} type={detailPageCategory.TREASURY_PROPOSAL}>
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

        <DetailItem
          onReply={focusEditor}
          type={detailPageCategory.TREASURY_PROPOSAL}
        />
        <Metadata treasuryProposal={detail?.onchainData} />
        <Timeline treasuryProposal={detail?.onchainData} />
        {CommentComponent}
      </DetailLayout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { id, page, page_size: pageSize } = context.query;

  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`treasury/proposals/${id}`),
  ]);

  if (!detail) {
    return to404(context);
  }

  const { result: comments } = await nextApi.fetch(
    `treasury/proposals/${detail._id}/comments`,
    {
      page: page ?? "last",
      pageSize: Math.min(pageSize ?? 50, 100),
    }
  );

  return {
    props: {
      detail,
      comments: comments ?? EmptyList,
    },
  };
});
