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
import {
  gov2ReferendumsCommentApi,
  gov2ReferendumsDetailApi,
} from "next-common/services/url";
import Timeline from "components/gov2/timeline";
import Gov2ReferendumMetadata from "next-common/components/gov2/referendum/metadata";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { useCallback, useEffect, useState } from "react";
import useWaitSyncBlock from "next-common/utils/hooks/useWaitSyncBlock";
import { EmptyList } from "next-common/utils/constants";
import Breadcrumb from "next-common/components/_Breadcrumb";
import { parseGov2TrackName } from "next-common/utils/gov2";
import ReferendaBusiness from "../../../components/gov2/business";
import { unsetIssuance } from "next-common/store/reducers/gov2ReferendumSlice";
import { useDispatch } from "react-redux";
import BreadcrumbWrapper, {
  BreadcrumbHideOnMobileText,
} from "next-common/components/detail/common/BreadcrumbWrapper";

export default withLoginUserRedux(({ detail: ssrDetail, comments }) => {
  const [detail, setDetail] = useState(ssrDetail);
  useEffect(() => setDetail(ssrDetail), [ssrDetail]);
  const isMounted = useIsMounted();
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(unsetIssuance());
    };
  }, [dispatch]);

  const { CommentComponent, focusEditor } = useUniversalComments({
    detail,
    comments,
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

  const { id: trackId, name: trackName } = detail?.onchainData?.trackInfo;
  const breadcrumbItems = [
    {
      path: "/referenda",
      content: "Referenda",
    },
    {
      path: `/referenda/track/${trackId}`,
      content: parseGov2TrackName(trackName),
    },
    {
      content: (
        <>
          <BreadcrumbHideOnMobileText>Referendum</BreadcrumbHideOnMobileText> #
          {detail.referendumIndex}
        </>
      ),
    },
  ];

  return (
    <PostProvider post={detail}>
      <DetailWithRightLayout
        seoInfo={{
          title: detail?.title,
          desc,
          ogImage: getBannerUrl(detail?.bannerCid),
        }}
      >
        <BreadcrumbWrapper>
          <Breadcrumb items={breadcrumbItems} />
        </BreadcrumbWrapper>

        <DetailItem onReply={focusEditor} />

        <Gov2Sidebar onVoteFinalized={onVoteFinalized} />

        <ReferendaBusiness />
        <Gov2ReferendumMetadata detail={detail} />

        <Timeline trackInfo={detail?.onchainData?.trackInfo} />

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
