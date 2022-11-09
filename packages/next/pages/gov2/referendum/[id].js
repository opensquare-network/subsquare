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
import {
  gov2ReferendumsCommentApi,
  gov2ReferendumsDetailApi,
} from "next-common/services/url";
import Timeline from "components/gov2/timeline";
import Gov2ReferendumMetadata from "next-common/components/gov2/referendum/metadata";
import useApi from "next-common/utils/hooks/useSelectedEnpointApi";

export default withLoginUserRedux(({ loginUser, detail, comments, chain }) => {
  const api = useApi(chain);

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
          title: detail?.title || "Untitled",
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

        <Gov2ReferendumMetadata api={api} detail={detail} chain={chain} />

        <Timeline
          timeline={detail?.onchainData?.timeline}
          trackInfo={detail?.onchainData?.trackInfo}
          chain={chain}
          type={detailPageCategory.GOV2_REFERENDUM}
        />

        {CommentComponent}
      </DetailWithRightLayout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { id, page, page_size } = context.query;
  const pageSize = Math.min(page_size ?? 50, 100);

  const { result: detail } = await ssrNextApi.fetch(
    gov2ReferendumsDetailApi(id)
  );

  if (!detail) {
    return to404(context);
  }

  const postId = detail?._id;
  const { result: comments } = await ssrNextApi.fetch(
    gov2ReferendumsCommentApi(postId),
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
