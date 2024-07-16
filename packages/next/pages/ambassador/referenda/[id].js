import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import {
  getAmbassadorReferendumCommentsUrl,
  getAmbassadorReferendumUrl,
} from "next-common/services/url";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { fetchDetailComments } from "next-common/services/detail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { EmptyList } from "next-common/utils/constants";
import {
  PostProvider,
  useOnchainData,
  usePost,
} from "next-common/context/post";
import { usePageProps } from "next-common/context/page";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { getBannerUrl } from "next-common/utils/banner";
import DetailLayout from "next-common/components/layout/DetailLayout";
import AmbassadorBreadcrumb from "next-common/components/ambassador/breadcrumb";
import { useTrack } from "next-common/context/post/gov2/track";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import CheckUnFinalizedBase from "next-common/components/checkUnFinalizedBase";
import React from "react";
import AmbassadorReferendaDetail from "next-common/components/detail/ambassador";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import DetailMultiTabs from "next-common/components/detail/detailMultiTabs";
import useSubFellowshipReferendumInfo from "next-common/hooks/fellowship/useSubFellowshipReferendumInfo";
import { useFellowshipReferendumInfo } from "next-common/hooks/fellowship/useFellowshipReferendumInfo";
import FellowshipReferendumSideBar from "../../../components/fellowship/referendum/sidebar";
import CollectivesProvider from "next-common/context/collectives/collectives";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";

const Gov2ReferendumMetadata = dynamicClientOnly(() =>
  import("next-common/components/gov2/referendum/metadata"),
);

const Timeline = dynamicClientOnly(() =>
  import("../../../components/gov2/timeline"),
);

const Gov2ReferendumCall = dynamicClientOnly(() =>
  import("next-common/components/gov2/referendum/call"),
);

function AmbassadorContent() {
  const post = usePost();

  useSubFellowshipReferendumInfo("ambassadorReferenda");
  const info = useFellowshipReferendumInfo();
  const onchainData = useOnchainData();
  const proposal = onchainData?.proposal ?? {};
  useSubscribePostDetail(post?.referendumIndex);

  return (
    <CollectivesProvider section="ambassador">
      <ContentWithComment>
        <AmbassadorReferendaDetail />
        <FellowshipReferendumSideBar />
        <DetailMultiTabs
          call={(proposal?.call || proposal.inline) && <Gov2ReferendumCall />}
          metadata={
            <Gov2ReferendumMetadata info={info} pallet="fellowshipReferenda" />
          }
          timeline={<Timeline trackInfo={post?.onchainData?.trackInfo} />}
        />
      </ContentWithComment>
    </CollectivesProvider>
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
      <ReferendumPageImpl />
    </PostProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;
  const { result: detail } = await nextApi.fetch(
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

  return {
    props: {
      detail,
      comments: comments ?? EmptyList,
      ...tracksProps,
    },
  };
});
