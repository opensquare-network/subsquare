import Back from "next-common/components/back";
import DetailWithRightLayout from "next-common/components/layout/detailWithRightLayout";
import { PostProvider } from "next-common/context/post";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { to404 } from "next-common/utils/serverSideUtil";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { getBannerUrl } from "next-common/utils/banner";
import DetailItem from "components/detailItem";
import Gov2Sidebar from "components/gov2/sidebar";
import nextApi, { ssrNextApi } from "next-common/services/nextApi";
import useUniversalComments from "components/universalComments";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import {
  gov2ReferendumsCommentApi,
  gov2ReferendumsDetailApi,
} from "next-common/services/url";
import Timeline from "components/gov2/timeline";
import Gov2ReferendumMetadata from "next-common/components/gov2/referendum/metadata";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { useCallback, useEffect, useState } from "react";
import useWaitSyncBlock from "next-common/utils/hooks/useWaitSyncBlock";
import { EmptyList } from "next-common/components/emptyList";

export default withLoginUserRedux(({ detail: ssrDetail, comments }) => {
  const [detail, setDetail] = useState(ssrDetail);
  useEffect(() => setDetail(ssrDetail), [ssrDetail]);
  const isMounted = useIsMounted();

  const { CommentComponent, focusEditor } = useUniversalComments({
    detail,
    comments,
    type: detailPageCategory.GOV2_REFERENDUM,
  });

  const desc = getMetaDesc(detail);

  const refreshPageData = useCallback(async () => {
    const { result } = await nextApi.fetch(
      gov2ReferendumsDetailApi(detail.referendumIndex)
    );
    if (result && isMounted.current) {
      setDetail(result);
    }
  }, [detail, isMounted]);

  const onVoteFinalized = useWaitSyncBlock("Referendum voted", refreshPageData);

  return (
    <PostProvider post={detail} type={detailPageCategory.GOV2_REFERENDUM}>
      <DetailWithRightLayout
        seoInfo={{
          title: detail?.title,
          desc,
          ogImage: getBannerUrl(detail?.bannerCid),
        }}
      >
        <Back href="/referenda" text="Back to Referenda" />

        <DetailItem
          onReply={focusEditor}
          type={detailPageCategory.GOV2_REFERENDUM}
        />

        <Gov2Sidebar detail={detail} onVoteFinalized={onVoteFinalized} />

        <Gov2ReferendumMetadata detail={detail} />

        <Timeline
          timeline={detail?.onchainData?.timeline}
          trackInfo={detail?.onchainData?.trackInfo}
          type={detailPageCategory.GOV2_REFERENDUM}
        />

        {CommentComponent}
      </DetailWithRightLayout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
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
    },
  };
});
