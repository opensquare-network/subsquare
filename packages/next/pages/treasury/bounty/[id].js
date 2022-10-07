import Back from "next-common/components/back";
import DetailItem from "components/detailItem";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import { getNode } from "next-common/utils";
import Timeline from "components/bounty/timeline";
import { to404 } from "next-common/utils/serverSideUtil";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import Metadata from "next-common/components/treasury/bounty/metadata";
import ChildBountiesTable from "../../../components/bounty/childBountiesTable";
import useUniversalComments from "components/universalComments";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { NoticeWrapper } from "next-common/components/styled/containers/titleContainer";
import TreasuryCountDown from "next-common/components/treasury/common/countdown";
import { getBannerUrl } from "next-common/utils/banner";

/**
 *
 * @param data bounty on chain data
 * @constructor
 */
function BountyCountDown({ data = {} }) {
  if (data.state?.state !== "PendingPayout") {
    return null;
  }

  const {
    meta: {
      status: {
        pendingPayout: { unlockAt } = {}
      } = {}
    } = {}
  } = data

  const timeline = data.timeline ?? [];
  const awardedItem = [...timeline].reverse().find(((item) => [item.name, item.method].includes("BountyAwarded")));
  if (!awardedItem || !unlockAt) {
    return null
  }

  return (
    <NoticeWrapper>
      <TreasuryCountDown
        startHeight={ awardedItem.indexer?.blockHeight }
        targetHeight={ unlockAt }
        prefix="Claimable"
      />
    </NoticeWrapper>
  );
}

export default withLoginUserRedux(
  ({ loginUser, detail, childBounties, comments, chain }) => {
    const { CommentComponent, focusEditor } = useUniversalComments({
      detail,
      comments,
      loginUser,
      chain,
      type: detailPageCategory.TREASURY_BOUNTY,
    });

    const node = getNode(chain);
    if (!node) {
      return null;
    }
    const decimals = node.decimals;
    const symbol = node.symbol;

    const desc = getMetaDesc(detail);
    return (
      <DetailLayout
        user={ loginUser }
        seoInfo={ { title: detail?.title, desc, ogImage: getBannerUrl(detail?.bannerCid) } }
      >
        <Back href={ `/treasury/bounties` } text="Back to Bounties" />
        <DetailItem
          data={ detail }
          user={ loginUser }
          chain={ chain }
          onReply={ focusEditor }
          type={ detailPageCategory.TREASURY_BOUNTY }
          countDown={ <BountyCountDown data={ detail.onchainData } /> }
        />
        <Metadata meta={ detail.onchainData?.meta } chain={ chain } />
        <ChildBountiesTable { ...{ childBounties, decimals, symbol } } />
        <Timeline bounty={ detail?.onchainData } chain={ chain } />
        { CommentComponent }
      </DetailLayout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { id, page, page_size } = context.query;
  const pageSize = Math.min(page_size ?? 50, 100);

  const [{ result: detail }, { result: childBounties }] = await Promise.all([
    nextApi.fetch(`treasury/bounties/${ id }`),
    nextApi.fetch(`treasury/bounties/${ id }/child-bounties`, { pageSize: 5 }),
  ]);

  if (!detail) {
    return to404(context);
  }

  const { result: comments } = await nextApi.fetch(
    `treasury/bounties/${ detail._id }/comments`,
    {
      page: page ?? "last",
      pageSize,
    }
  );

  return {
    props: {
      detail,
      childBounties: childBounties ?? EmptyList,
      comments: comments ?? EmptyList,
      chain,
      redux: {
        detail,
        detailType: detailPageCategory.TREASURY_BOUNTY,
      },
    },
  };
});
