import { withCommonProps } from "next-common/lib";
import nextApi, { backendApi } from "next-common/services/nextApi";
import {
  ambassadorParamsApi,
  getAmbassadorReferendumCommentsUrl,
  getAmbassadorReferendumUrl,
} from "next-common/services/url";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { fetchDetailComments } from "next-common/services/detail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { EmptyList } from "next-common/utils/constants";
import { PostProvider, usePost } from "next-common/context/post";
import { usePageProps } from "next-common/context/page";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { getBannerUrl } from "next-common/utils/banner";
import DetailLayout from "next-common/components/layout/DetailLayout";
import AmbassadorBreadcrumb from "next-common/components/ambassador/breadcrumb";
import { useTrack } from "next-common/context/post/gov2/track";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import CheckUnFinalizedBase from "next-common/components/checkUnFinalizedBase";
import AmbassadorReferendaDetail from "next-common/components/detail/ambassador";
import FellowshipReferendumSideBar from "../../../components/fellowship/referendum/sidebar";
import CollectivesProvider from "next-common/context/collectives/collectives";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import { OffChainArticleActionsProvider } from "next-common/noSima/context/articleActionsProvider";
import { OffChainCommentActionsProvider } from "next-common/noSima/context/commentActionsProvider";
import { ReferendaPalletProvider } from "next-common/context/referenda/pallet";
import useSubReferendumInfo from "next-common/hooks/referenda/useSubReferendumInfo";
import AmbassadorReferendaDetailMultiTabs from "components/tabs/ambassadorReferendaDetailMultiTabs";

function AmbassadorContent() {
  const post = usePost();
  const { ambassadorParams } = usePageProps();

  useSubReferendumInfo("ambassadorReferenda");
  useSubscribePostDetail(post?.referendumIndex);

  return (
    <OffChainArticleActionsProvider>
      <OffChainCommentActionsProvider>
        <CollectivesProvider section="ambassador" params={ambassadorParams}>
          <ContentWithComment>
            <AmbassadorReferendaDetail />
            <FellowshipReferendumSideBar />
            <AmbassadorReferendaDetailMultiTabs />
          </ContentWithComment>
        </CollectivesProvider>
      </OffChainCommentActionsProvider>
    </OffChainArticleActionsProvider>
  );
}

function ReferendumPageCommon({ breadcrumbs, postContent }) {
  const detail = usePost();

  const seoInfo = {
    title: detail?.title,
    desc: getMetaDesc(detail),
    ogImage: getBannerUrl(detail?.bannerCid),
  };

  return (
    <DetailLayout breadcrumbs={breadcrumbs} seoInfo={seoInfo} hasSidebar>
      {postContent}
    </DetailLayout>
  );
}

function ReferendumPageWithPost() {
  const track = useTrack();
  const post = usePost();

  return (
    <ReferendumPageCommon
      breadcrumbs={
        <AmbassadorBreadcrumb
          track={track}
          referendumIndex={post?.referendumIndex}
        />
      }
      postContent={<AmbassadorContent />}
    />
  );
}

function ReferendumPageImpl() {
  const detail = usePost();
  const { id } = usePageProps();
  if (!detail) {
    return (
      <ReferendumPageCommon
        breadcrumbs={<AmbassadorBreadcrumb referendumIndex={id} />}
        postContent={
          <CheckUnFinalizedBase
            onChainDataFetcher={async (api) =>
              api.query.ambassadorReferenda?.referendumInfoFor(id)
            }
            serverPostFetcher={() =>
              nextApi.fetch(getAmbassadorReferendumUrl(id))
            }
          />
        }
      />
    );
  }

  return <ReferendumPageWithPost />;
}

export default function ReferendumPage({ detail }) {
  return (
    <PostProvider post={detail}>
      <ReferendaPalletProvider pallet="ambassadorReferenda">
        <ReferendumPageImpl />
      </ReferendaPalletProvider>
    </PostProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;
  const { result: detail } = await backendApi.fetch(
    getAmbassadorReferendumUrl(id),
  );
  const tracksProps = await fetchOpenGovTracksProps();
  if (!detail) {
    return getNullDetailProps(id, tracksProps);
  }

  const comments = await fetchDetailComments(
    getAmbassadorReferendumCommentsUrl(detail?._id),
    context,
  );

  const { result: ambassadorParams = {} } = await backendApi.fetch(
    ambassadorParamsApi,
  );

  return {
    props: {
      detail,
      comments: comments ?? EmptyList,
      ...tracksProps,
      ambassadorParams,
    },
  };
});
