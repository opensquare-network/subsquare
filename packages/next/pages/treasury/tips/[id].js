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
import NonNullPost from "next-common/components/nonNullPost";
import TipDetail from "next-common/components/detail/treasury/tip";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import DetailLayout from "next-common/components/layout/DetailLayout";
import DetailMultiTabs from "next-common/components/detail/detailMultiTabs";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import ContentWithUniversalComment from "components/details/contentWithUniversalComment";

function TreasuryTipContent({ comments }) {
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

export default function TipPage({ id, detail: renderDetail, comments }) {
  const detail = usePost(renderDetail);
  let postContent;
  if (detail) {
    postContent = (
      <NonNullPost>
        <TreasuryTipContent comments={comments} />
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
        hasSidebar
      >
        {postContent}
      </DetailLayout>
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
