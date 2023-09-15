import DetailItem from "components/detailItem";
import { withCommonProps } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Business from "components/external/business";
import Metadata from "components/external/metadata";
import DemocracyExternalProposalCall from "components/external/call";
import Timeline from "components/external/timeline";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider, usePost } from "next-common/context/post";
import CheckUnFinalized from "components/external/checkUnFinalized";
import NonNullPost from "next-common/components/nonNullPost";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import DetailLayout from "next-common/components/layout/DetailLayout";
import DetailMultiTabs from "next-common/components/detail/detailMultiTabs";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import ContentWithUniversalComment from "components/details/contentWithUniversalComment";

function DemocracyExternalContent({ detail, comments }) {
  useSubscribePostDetail(detail?.externalProposalHash);

  const external = detail?.onchainData || {};
  const call = external?.preImage?.call;

  return (
    <ContentWithUniversalComment comments={comments}>
      <DetailItem />
      <DetailMultiTabs
        call={
          call && (
            <DemocracyExternalProposalCall
              call={call}
              shorten={external.preImage.shorten}
              motionIndex={external.motionIndex}
              referendumIndex={external.referendumIndex}
            />
          )
        }
        business={<Business external={detail?.onchainData} />}
        metadata={<Metadata external={detail?.onchainData} />}
        timeline={<Timeline />}
      />
    </ContentWithUniversalComment>
  );
}

export default function DemocracyExternalPage({
  id,
  detail: renderDetail,
  comments,
}) {
  const detail = usePost(renderDetail);
  let postContent;
  if (detail) {
    postContent = (
      <NonNullPost>
        <DemocracyExternalContent detail={detail} comments={comments} />
      </NonNullPost>
    );
  } else {
    const hash = id?.split("_").pop();
    postContent = <CheckUnFinalized id={hash} />;
  }

  const desc = getMetaDesc(detail);
  return (
    <PostProvider post={detail}>
      <DetailLayout
        seoInfo={{
          title: detail?.title,
          desc,
          ogImage: getBannerUrl(detail?.bannerCid),
        }}
      >
        {postContent}
      </DetailLayout>
    </PostProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;
  const { result: detail } = await nextApi.fetch(`democracy/externals/${id}`);

  if (!detail) {
    return getNullDetailProps(id);
  }

  const comments = await fetchDetailComments(
    `democracy/externals/${detail._id}/comments`,
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
