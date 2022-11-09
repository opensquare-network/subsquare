import Back from "next-common/components/back";
import DetailItem from "components/detailItem";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import { getNode } from "next-common/utils";
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

export default withLoginUserRedux(({ loginUser, detail, comments, chain }) => {
  const { CommentComponent, focusEditor } = useUniversalComments({
    detail,
    comments,
    loginUser,
    type: detailPageCategory.DEMOCRACY_EXTERNAL,
  });

  const node = getNode(chain);
  if (!node) {
    return null;
  }

  const desc = getMetaDesc(detail);
  return (
    <PostProvider post={detail} type={detailPageCategory.DEMOCRACY_EXTERNAL}>
      <DetailLayout
        user={loginUser}
        seoInfo={{
          title: detail?.title,
          desc,
          ogImage: getBannerUrl(detail?.bannerCid),
        }}
      >
        <Back href={`/democracy/externals`} text="Back to Externals" />
        <DetailItem
          onReply={focusEditor}
          type={detailPageCategory.DEMOCRACY_EXTERNAL}
        />
        <Business external={detail?.onchainData} chain={chain} />
        <Metadata external={detail?.onchainData} chain={chain} />
        <Timeline timeline={detail?.onchainData?.timeline} chain={chain} />
        {CommentComponent}
      </DetailLayout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

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
      chain,
    },
  };
});
