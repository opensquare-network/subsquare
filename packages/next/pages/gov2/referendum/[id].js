import Back from "next-common/components/back";
import DetailWithRightLayout from "next-common/components/layout/detailWithRightLayout";
import { PostProvider } from "next-common/context/post";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import useApi from "next-common/utils/hooks/useSelectedEnpointApi";
import { to404 } from "next-common/utils/serverSideUtil";
import mockDetail from "next-common/utils/mocks/gov2-detail.json";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { getBannerUrl } from "next-common/utils/banner";
import DetailItem from "components/detailItem";
import Gov2Sidebar from "components/gov2/sidebar";

export default withLoginUserRedux(({ loginUser, detail, comments, chain }) => {
  const api = useApi(chain);

  const desc = getMetaDesc(detail);

  return (
    <PostProvider post={detail}>
      <DetailWithRightLayout
        user={loginUser}
        seoInfo={{
          title: detail?.title,
          desc,
          ogImage: getBannerUrl(detail?.bannerCid),
        }}
      >
        <Back href="/gov2" text="Back to Referenda" />

        <DetailItem
          chain={chain}
          referendumInfo={detail?.onchainData?.info}
          referdumIndex={detail?.referendumIndex}
        />

        <Gov2Sidebar chain={chain} />
      </DetailWithRightLayout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { id, page, page_size } = context.query;
  const pageSize = Math.min(page_size ?? 50, 100);

  // FIXME: gov2 detail fetch
  const detail = mockDetail;

  if (!detail) {
    return to404(context);
  }

  // FIXME: gov2 detail fetch
  const postId = detail?._id;
  const comments = [];

  return {
    props: {
      detail,
      comments,
      chain,
    },
  };
});
