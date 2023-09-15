import { withCommonProps } from "next-common/lib";
import { EmptyList } from "next-common/utils/constants";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import Timeline from "components/tip/timeline";
import Metadata from "components/tip/metadata";
import Tipper from "components/tipper";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider, usePost } from "next-common/context/post";
import CheckUnFinalized from "components/tip/checkUnFinalized";
import TipDetail from "next-common/components/detail/treasury/tip";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import DetailLayout from "next-common/components/layout/DetailLayout";
import DetailMultiTabs from "next-common/components/detail/detailMultiTabs";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import ContentWithUniversalComment from "components/details/contentWithUniversalComment";
import { usePageProps } from "next-common/context/page";

function TreasuryTipContent() {
  const { comments } = usePageProps();
  const post = usePost();
  useSubscribePostDetail(`${post?.height}_${post?.hash}`);

  return (
    <ContentWithUniversalComment comments={comments}>
      <TipDetail />
      <Tipper />
      <DetailMultiTabs
        metadata={<Metadata tip={post?.onchainData} />}
        timeline={<Timeline tip={post?.onchainData} />}
      />
    </ContentWithUniversalComment>
  );
}

function TipContentWithNullGuard() {
  const { id } = usePageProps();
  const detail = usePost();

  if (!detail) {
    const hash = id?.split("_").pop();
    return <CheckUnFinalized id={hash} />;
  }

  return <TreasuryTipContent />;
}

function TipPageImpl() {
  const post = usePost();

  const desc = getMetaDesc(post);

  return (
    <DetailLayout
      seoInfo={{
        title: post?.title,
        desc,
        ogImage: getBannerUrl(post?.bannerCid),
      }}
      hasSidebar
    >
      <TipContentWithNullGuard />
    </DetailLayout>
  );
}

export default function TipPage({ detail }) {
  return (
    <PostProvider post={detail}>
      <TipPageImpl />
    </PostProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;

  const { result: detail } = await nextApi.fetch(`treasury/tips/${id}`);

  if (!detail) {
    return getNullDetailProps(id);
  }

  //TODO: remove the dirty fix
  detail.authors = detail.authors?.filter((author) =>
    isPolkadotAddress(author),
  );

  const comments = await fetchDetailComments(
    `treasury/tips/${detail._id}/comments`,
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
