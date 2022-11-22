import DetailItem from "components/detailItem";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import { to404 } from "next-common/utils/serverSideUtil";
import Business from "components/external/business";
import Metadata from "components/external/metadata";
import Timeline from "components/external/timeline";
import useUniversalComments from "components/universalComments";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider } from "next-common/context/post";
import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import Breadcrumb from "next-common/components/_Breadcrumb";
import { hashEllipsis } from "next-common/utils";

export default withLoginUserRedux(({ detail, comments }) => {
  const { CommentComponent, focusEditor } = useUniversalComments({
    detail,
    comments,
    type: detailPageCategory.DEMOCRACY_EXTERNAL,
  });

  const desc = getMetaDesc(detail);

  const breadcrumbItems = [
    {
      content: "Overview",
      path: "/",
    },
    {
      content: "Democracy Externals",
      path: "/democracy/externals",
    },
    {
      content: hashEllipsis(detail?.externalProposalHash),
    },
  ];

  return (
    <PostProvider post={detail} type={detailPageCategory.DEMOCRACY_EXTERNAL}>
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
          type={detailPageCategory.DEMOCRACY_EXTERNAL}
        />
        <Business external={detail?.onchainData} />
        <Metadata external={detail?.onchainData} />
        <Timeline timeline={detail?.onchainData?.timeline} />
        {CommentComponent}
      </DetailLayout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { id, page, page_size } = context.query;
  const pageSize = Math.min(page_size ?? 50, 100);

  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`democracy/externals/${id}`),
  ]);

  if (!detail) {
    return to404(context);
  }

  const { result: comments } = await nextApi.fetch(
    `democracy/externals/${detail._id}/comments`,
    {
      page: page ?? "last",
      pageSize,
    }
  );

  return {
    props: {
      detail,
      comments: comments ?? EmptyList,
    },
  };
});
