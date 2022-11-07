import Back from "next-common/components/back";
import DetailWithRightLayout from "next-common/components/layout/detailWithRightLayout";
import { PostProvider } from "next-common/context/post";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { to404 } from "next-common/utils/serverSideUtil";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { getBannerUrl } from "next-common/utils/banner";
import DetailItem from "components/detailItem";
import Gov2Sidebar from "components/gov2/sidebar";
import { ssrNextApi } from "next-common/services/nextApi";
import useUniversalComments from "components/universalComments";
import { detailPageCategory } from "next-common/utils/consts/business/category";

export default withLoginUserRedux(({ loginUser, detail, comments, chain }) => {
  const { CommentComponent, focusEditor } = useUniversalComments({
    detail,
    comments,
    loginUser,
    chain,
    type: detailPageCategory.GOV2_REFERENDUM,
  });

  const desc = getMetaDesc(detail);

  return (
    <PostProvider post={detail} type={detailPageCategory.GOV2_REFERENDUM}>
      <DetailWithRightLayout
        user={loginUser}
        seoInfo={{
          title: detail?.title,
          desc,
          ogImage: getBannerUrl(detail?.bannerCid),
        }}
      >
        <Back href="/gov2" text="Back to Gov2/Referenda" />

        <DetailItem
          onReply={focusEditor}
          chain={chain}
          type={detailPageCategory.GOV2_REFERENDUM}
        />

        <Gov2Sidebar chain={chain} detail={detail} />
        {CommentComponent}
      </DetailWithRightLayout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { id, page, page_size } = context.query;
  const pageSize = Math.min(page_size ?? 50, 100);

  const { result: detail } = await ssrNextApi.fetch(`gov2/referendums/${id}`);

  if (!detail) {
    return to404(context);
  }

  const postId = detail?._id;
  const { result: comments } = await ssrNextApi.fetch(
    `gov2/referendums/${postId}/comments`,
    {
      page: page ?? "last",
      pageSize,
    }
  );

  return {
    props: {
      detail,
      comments: comments ?? EmptyList,
      chain,
    },
  };
});
