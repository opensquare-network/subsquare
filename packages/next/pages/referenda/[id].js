import {
  PostProvider,
  useOnchainData,
  usePost,
} from "next-common/context/post";
import { withCommonProps } from "next-common/lib";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { getBannerUrl } from "next-common/utils/banner";
import Gov2Sidebar from "components/gov2/sidebar";
import { ssrNextApi } from "next-common/services/nextApi";
import {
  gov2ReferendumsCommentApi,
  gov2ReferendumsDetailApi,
  gov2ReferendumsVoteStatsApi,
} from "next-common/services/url";
import Timeline from "components/gov2/timeline";
import Gov2ReferendumMetadata from "next-common/components/gov2/referendum/metadata";
import { useEffect } from "react";
import { EmptyList } from "next-common/utils/constants";
import Breadcrumb from "next-common/components/_Breadcrumb";
import { unsetIssuance } from "next-common/store/reducers/gov2ReferendumSlice";
import { useDispatch } from "react-redux";
import BreadcrumbWrapper, {
  BreadcrumbHideOnMobileText,
} from "next-common/components/detail/common/BreadcrumbWrapper";
import CheckUnFinalized from "components/gov2/checkUnFinalized";
import ReferendaBreadcrumb from "next-common/components/referenda/breadcrumb";
import NonNullPost from "next-common/components/nonNullPost";
import ReferendaDetail from "next-common/components/detail/referenda";
import useSubReferendumInfo from "next-common/hooks/referenda/useSubReferendumInfo";
import { useReferendumInfo } from "next-common/hooks/referenda/useReferendumInfo";
import { clearVotes } from "next-common/store/reducers/referenda/votes";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import DetailLayout from "next-common/components/layout/DetailLayout";
import DetailMultiTabs from "next-common/components/detail/detailMultiTabs";
import Gov2ReferendumCall from "next-common/components/gov2/referendum/call";
import Gov2ReferendaVotesBubble from "next-common/components/gov2/referendum/votesBubble";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import ContentWithUniversalComment from "components/details/contentWithUniversalComment";

function ReferendumContent({ comments }) {
  const post = usePost();
  const dispatch = useDispatch();
  useSubReferendumInfo();
  const info = useReferendumInfo();
  const onchainData = useOnchainData();
  const proposal = onchainData?.proposal ?? {};

  useEffect(() => {
    return () => {
      dispatch(unsetIssuance());
      dispatch(clearVotes());
    };
  }, [dispatch]);

  useSubscribePostDetail(post?.referendumIndex);

  return (
    <ContentWithUniversalComment comments={comments}>
      <ReferendaDetail />

      <Gov2Sidebar />

      <DetailMultiTabs
        call={proposal?.call && <Gov2ReferendumCall />}
        metadata={<Gov2ReferendumMetadata info={info} />}
        timeline={<Timeline trackInfo={post?.onchainData?.trackInfo} />}
        votesBubble={<Gov2ReferendaVotesBubble />}
      />
    </ContentWithUniversalComment>
  );
}

function UnFinalizedBreadcrumb({ id }) {
  return (
    <BreadcrumbWrapper>
      <Breadcrumb
        items={[
          {
            path: "/referenda",
            content: "Referenda",
          },
          {
            content: (
              <>
                <BreadcrumbHideOnMobileText>
                  Referendum
                </BreadcrumbHideOnMobileText>{" "}
                {`#${id}`}
              </>
            ),
          },
        ]}
      />
    </BreadcrumbWrapper>
  );
}

export default function ReferendumPage({ id, detail: renderDetail, comments }) {
  const detail = usePost(renderDetail);
  let postContent;
  let breadcrumbs;
  if (detail) {
    postContent = (
      <NonNullPost>
        <ReferendumContent comments={comments} />
      </NonNullPost>
    );
    breadcrumbs = <ReferendaBreadcrumb />;
  } else {
    postContent = <CheckUnFinalized id={id} />;
    breadcrumbs = <UnFinalizedBreadcrumb id={id} />;
  }

  const desc = getMetaDesc(detail);

  const seoInfo = {
    title: detail?.title,
    desc,
    ogImage: getBannerUrl(detail?.bannerCid),
  };

  return (
    <PostProvider post={detail}>
      <DetailLayout seoInfo={seoInfo} breadcrumbs={breadcrumbs} hasSidebar>
        {postContent}
      </DetailLayout>
    </PostProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;
  const { result: detail } = await ssrNextApi.fetch(
    gov2ReferendumsDetailApi(id),
  );

  if (!detail) {
    return getNullDetailProps(id, { voteStats: {} });
  }

  const { result: voteStats } = await ssrNextApi.fetch(
    gov2ReferendumsVoteStatsApi(id),
  );

  const comments = await fetchDetailComments(
    gov2ReferendumsCommentApi(detail?._id),
    context,
  );
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      detail,
      voteStats: voteStats ?? {},
      comments: comments ?? EmptyList,

      ...tracksProps,
    },
  };
});
