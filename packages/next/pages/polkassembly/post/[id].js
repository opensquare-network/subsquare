import Back from "next-common/components/back";
import DetailItem from "components/polkassembly/detailItem";
import PolkassemblyComments from "components/polkassembly/comment";
import usePolkassemblyPostData from "components/polkassembly/usePolkassemblyPostData";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { to404 } from "next-common/utils/serverSideUtil";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { getBannerUrl } from "next-common/utils/banner";

export default withLoginUserRedux(({ loginUser, detail, chain }) => {
  const polkassemblyId = detail?.polkassemblyId;
  const { comments, postReactions, loadingComments } = usePolkassemblyPostData({
    polkassemblyId,
    chain,
  });

  const desc = getMetaDesc(detail);
  return (
    <DetailLayout
      user={loginUser}
      seoInfo={{ title: detail?.title, desc, ogImage: getBannerUrl(detail?.bannerCid) }}
    >
      <Back
        href={`/polkassembly/discussions`}
        text="Back to Polkassembly Discussions"
      />
      <DetailItem
        data={detail}
        chain={chain}
        postReactions={postReactions}
        type={detailPageCategory.PA_POST}
      />
      <PolkassemblyComments
        isLoading={loadingComments}
        comments={comments}
        chain={chain}
        type={detailPageCategory.PA_POST}
        paId={polkassemblyId}
      />
    </DetailLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
  const { id } = context.query;
  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`polkassembly-discussions/${id}`),
  ]);

  if (!detail) {
    return to404(context);
  }

  return {
    props: {
      detail,
      chain,
    },
  };
});
