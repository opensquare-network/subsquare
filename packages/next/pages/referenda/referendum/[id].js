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
import Breadcrumb from "next-common/components/_Breadcrumb";
import Link from "next/link";
import { getTrackName } from "next-common/utils/gov2/getTrackName";
import { parseGov2TrackName } from "next-common/utils/gov2";
import styled, { css } from "styled-components";
import { smcss } from "next-common/utils/responsive";

const BreadcrumbHideOnMobileText = styled.span`
  ${smcss(css`
    display: none;
  `)}
`;
const BreadcrumbWrapper = styled.div`
  ${smcss(css`
    padding: 0 16px;
  `)}
`;

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

  const trackName = getTrackName(detail);

  return (
    <PostProvider post={detail} type={detailPageCategory.GOV2_REFERENDUM}>
      <DetailWithRightLayout
        seoInfo={{
          title: detail?.title,
          desc,
          ogImage: getBannerUrl(detail?.bannerCid),
        }}
      >
        <BreadcrumbWrapper>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link href="/referenda">Referenda</Link>
            </Breadcrumb.Item>
            {trackName && (
              <Breadcrumb.Item>
                <Link href={`/referenda/${trackName}`}>
                  {parseGov2TrackName(trackName)}
                </Link>
              </Breadcrumb.Item>
            )}
            <Breadcrumb.Item>
              <BreadcrumbHideOnMobileText>
                Referendum
              </BreadcrumbHideOnMobileText>{" "}
              #{detail.referendumIndex}
            </Breadcrumb.Item>
          </Breadcrumb>
        </BreadcrumbWrapper>

        <DetailItem
          onReply={focusEditor}
          type={detailPageCategory.GOV2_REFERENDUM}
        />

        <Gov2Sidebar detail={detail} onVoteFinalized={onVoteFinalized} />

        <Gov2ReferendumMetadata detail={detail} />

        <Timeline
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
