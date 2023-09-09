import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi } from "next-common/services/nextApi";
import {
  fellowshipTracksApi,
  getFellowshipReferendumCommentsUrl,
  getFellowshipReferendumUrl,
  gov2TracksApi,
} from "next-common/services/url";
import { EmptyList } from "next-common/utils/constants";
import {
  PostProvider,
  useOnchainData,
  usePost,
} from "next-common/context/post";
import { getBannerUrl } from "next-common/utils/banner";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import FellowshipBreadcrumb from "next-common/components/fellowship/breadcrumb";
import useUniversalComments from "../../../components/universalComments";
import Gov2ReferendumMetadata from "next-common/components/gov2/referendum/metadata";
import Timeline from "../../../components/gov2/timeline";
import FellowshipReferendumSideBar from "../../../components/fellowship/referendum/sidebar";
import CheckUnFinalized from "components/fellowship/checkUnFinalized";
import BreadcrumbWrapper, {
  BreadcrumbHideOnMobileText,
} from "next-common/components/detail/common/BreadcrumbWrapper";
import Breadcrumb from "next-common/components/_Breadcrumb";
import NonNullPost from "next-common/components/nonNullPost";
import FellowshipReferendaDetail from "next-common/components/detail/fellowship";
import useSubFellowshipReferendumInfo from "next-common/hooks/fellowship/useSubFellowshipReferendumInfo";
import { useFellowshipReferendumInfo } from "next-common/hooks/fellowship/useFellowshipReferendumInfo";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import DetailLayout from "next-common/components/layout/DetailLayout";
import DetailMultiTabs from "next-common/components/detail/detailMultiTabs";
import Gov2ReferendumCall from "next-common/components/gov2/referendum/call";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";

function FellowshipContent({ comments }) {
  const post = usePost();
  useSubFellowshipReferendumInfo();
  const info = useFellowshipReferendumInfo();
  const onchainData = useOnchainData();
  const proposal = onchainData?.proposal ?? {};

  const { CommentComponent, focusEditor } = useUniversalComments({
    detail: post,
    comments,
  });

  useSubscribePostDetail(post?.referendumIndex);

  return (
    <>
      <FellowshipReferendaDetail onReply={focusEditor} />
      <FellowshipReferendumSideBar />
      <DetailMultiTabs
        call={proposal?.call && <Gov2ReferendumCall />}
        metadata={
          <Gov2ReferendumMetadata info={info} pallet="fellowshipReferenda" />
        }
        timeline={<Timeline trackInfo={post?.onchainData?.trackInfo} />}
      />

      {CommentComponent}
    </>
  );
}

function UnFinalizedBreadcrumb({ id }) {
  return (
    <BreadcrumbWrapper>
      <Breadcrumb
        items={[
          {
            path: "/fellowship",
            content: "Fellowship",
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

export default withLoginUserRedux(({ id, detail, comments }) => {
  let postContent = null;
  let breadcrumbs;

  if (detail) {
    postContent = (
      <NonNullPost>
        <FellowshipContent comments={comments} />
      </NonNullPost>
    );
    breadcrumbs = <FellowshipBreadcrumb />;
  } else {
    postContent = (
      <>
        <CheckUnFinalized id={id} />
      </>
    );
    breadcrumbs = <UnFinalizedBreadcrumb id={id} />;
  }

  const seoInfo = {
    title: detail?.title,
    desc: getMetaDesc(detail),
    ogImage: getBannerUrl(detail?.bannerCid),
  };

  return (
    <PostProvider post={detail}>
      <DetailLayout breadcrumbs={breadcrumbs} seoInfo={seoInfo} hasSidebar>
        {postContent}
      </DetailLayout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { id } = context.query;

  const { result: detail } = await ssrNextApi.fetch(
    getFellowshipReferendumUrl(id),
  );
  if (!detail) {
    return getNullDetailProps(id);
  }

  const comments = await fetchDetailComments(
    getFellowshipReferendumCommentsUrl(detail?._id),
    context,
  );

  const [{ result: tracks }, { result: fellowshipTracks }] = await Promise.all([
    ssrNextApi.fetch(gov2TracksApi),
    ssrNextApi.fetch(fellowshipTracksApi),
  ]);

  return {
    props: {
      id,
      detail,
      comments: comments ?? EmptyList,

      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
    },
  };
});
