import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import {
  getFellowshipReferendumCommentsUrl,
  getFellowshipReferendumUrl,
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
import FellowshipReferendumSideBar from "../../../components/fellowship/referendum/sidebar";
import CheckUnFinalized from "components/fellowship/checkUnFinalized";
import BreadcrumbWrapper, {
  BreadcrumbHideOnMobileText,
} from "next-common/components/detail/common/BreadcrumbWrapper";
import Breadcrumb from "next-common/components/_Breadcrumb";
import FellowshipReferendaDetail from "next-common/components/detail/fellowship";
import useSubFellowshipReferendumInfo from "next-common/hooks/fellowship/useSubFellowshipReferendumInfo";
import { useFellowshipReferendumInfo } from "next-common/hooks/fellowship/useFellowshipReferendumInfo";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import DetailLayout from "next-common/components/layout/DetailLayout";
import DetailMultiTabs from "next-common/components/detail/detailMultiTabs";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import { usePageProps } from "next-common/context/page";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import CollectivesProvider from "next-common/context/collectives/collectives";

const Gov2ReferendumMetadata = dynamicClientOnly(() =>
  import("next-common/components/gov2/referendum/metadata"),
);

const Timeline = dynamicClientOnly(() =>
  import("../../../components/gov2/timeline"),
);

const Gov2ReferendumCall = dynamicClientOnly(() =>
  import("next-common/components/gov2/referendum/call"),
);

function FellowshipContent() {
  const post = usePost();

  useSubFellowshipReferendumInfo();
  const info = useFellowshipReferendumInfo();
  const onchainData = useOnchainData();
  const proposal = onchainData?.proposal ?? {};

  useSubscribePostDetail(post?.referendumIndex);

  return (
    <CollectivesProvider section="fellowship">
      <ContentWithComment>
        <FellowshipReferendaDetail />
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

function ReferendumNullPage() {
  const { id } = usePageProps();
  return (
    <ReferendumPageCommon
      breadcrumbs={<UnFinalizedBreadcrumb id={id} />}
      postContent={<CheckUnFinalized id={id} />}
    />
  );
}

function ReferendumPageWithPost() {
  return (
    <ReferendumPageCommon
      breadcrumbs={<FellowshipBreadcrumb />}
      postContent={<FellowshipContent />}
    />
  );
}

function ReferendumPageImpl() {
  const detail = usePost();

  if (!detail) {
    return <ReferendumNullPage />;
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
    getFellowshipReferendumUrl(id),
  );
  if (!detail) {
    return getNullDetailProps(id);
  }

  const comments = await fetchDetailComments(
    getFellowshipReferendumCommentsUrl(detail?._id),
    context,
  );
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      detail,
      comments: comments ?? EmptyList,

      ...tracksProps,
    },
  };
});
