import DetailItem from "components/polkassembly/detailItem";
import PolkassemblyComments from "components/polkassembly/comment";
import usePolkassemblyPostData from "components/polkassembly/usePolkassemblyPostData";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { to404 } from "next-common/utils/serverSideUtil";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider } from "next-common/context/post";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";

export default withLoginUserRedux(({ detail }) => {
  const polkassemblyId = detail?.polkassemblyId;
  const { comments, postReactions, loadingComments } = usePolkassemblyPostData({
    polkassemblyId,
  });

  const breadcrumbItems = [
    {
      content: "Polkassembly",
      path: "/polkassembly/discussions",
    },
    {
      content: "#" + polkassemblyId,
    },
  ];

  const desc = getMetaDesc(detail);
  return (
    <PostProvider post={detail}>
      <DetailLayout
        seoInfo={{
          title: detail?.title,
          desc,
          ogImage: getBannerUrl(detail?.bannerCid),
        }}
        breadcrumbs={breadcrumbItems}
      >
        <DetailItem postReactions={postReactions} />
        <PolkassemblyComments
          isLoading={loadingComments}
          comments={comments}
          paId={polkassemblyId}
        />
      </DetailLayout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { id } = context.query;
  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`polkassembly-discussions/${id}`),
  ]);

  if (!detail) {
    return to404();
  }

  const [{ result: tracks }, { result: fellowshipTracks }] = await Promise.all([
    nextApi.fetch(gov2TracksApi),
    nextApi.fetch(fellowshipTracksApi),
  ]);

  return {
    props: {
      detail,

      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
    },
  };
});
