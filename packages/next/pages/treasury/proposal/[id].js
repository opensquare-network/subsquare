import Back from "next-common/components/back";
import DetailItem from "components/detailItem";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Timeline from "components/treasuryProposal/timeline";
import Metadata from "next-common/components/treasury/proposal/metadata";
import { to404 } from "next-common/utils/serverSideUtil";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import useUniversalComments from "components/universalComments";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { getBannerUrl } from "next-common/utils/banner";

export default withLoginUserRedux(({ loginUser, detail, comments, chain }) => {
  const { CommentComponent, focusEditor } = useUniversalComments({
    detail,
    comments,
    loginUser,
    chain,
    type: detailPageCategory.TREASURY_PROPOSAL,
  });

  const desc = getMetaDesc(detail);
  return (
    <DetailLayout
      user={loginUser}
      seoInfo={{ title: detail?.title, desc, ogImage: getBannerUrl(detail?.bannerCid) }}
    >
      <Back href={`/treasury/proposals`} text="Back to Proposals" />
      <DetailItem
        data={detail}
        chain={chain}
        onReply={focusEditor}
        type={detailPageCategory.TREASURY_PROPOSAL}
      />
      <Metadata treasuryProposal={detail?.onchainData} chain={chain} />
      <Timeline treasuryProposal={detail?.onchainData} chain={chain} />
      {CommentComponent}
    </DetailLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { id, page, page_size } = context.query;
  const pageSize = Math.min(page_size ?? 50, 100);

  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`treasury/proposals/${id}`),
  ]);

  if (!detail) {
    return to404(context);
  }

  const { result: comments } = await nextApi.fetch(
    `treasury/proposals/${detail._id}/comments`,
    {
      page: page ?? "last",
      pageSize,
    }
  );

  return {
    props: {
      detail,
      comments: comments ?? EmptyList,
      chain,
      redux: {
        detail,
        detailType: detailPageCategory.TREASURY_PROPOSAL,
      },
    },
  };
});
