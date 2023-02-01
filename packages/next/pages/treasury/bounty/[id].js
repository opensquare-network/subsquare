import DetailItem from "components/detailItem";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import Timeline from "components/bounty/timeline";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import Metadata from "next-common/components/treasury/bounty/metadata";
import ChildBountiesTable from "../../../components/bounty/childBountiesTable";
import useUniversalComments from "components/universalComments";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { NoticeWrapper } from "next-common/components/styled/containers/titleContainer";
import TreasuryCountDown from "next-common/components/treasury/common/countdown";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider } from "next-common/context/post";
import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import Breadcrumb from "next-common/components/_Breadcrumb";
import CheckUnFinalized from "components/bounty/checkUnFinalized";
import NonNullPost from "next-common/components/nonNullPost";

/**
 *
 * @param data bounty on chain data
 * @constructor
 */
function BountyCountDown({ data = {} }) {
  if (data.state?.state !== "PendingPayout") {
    return null;
  }

  const { meta: { status: { pendingPayout: { unlockAt } = {} } = {} } = {} } =
    data;

  const timeline = data.timeline ?? [];
  const awardedItem = [...timeline]
    .reverse()
    .find((item) => [item.name, item.method].includes("BountyAwarded"));
  if (!awardedItem || !unlockAt) {
    return null;
  }

  return (
    <NoticeWrapper>
      <TreasuryCountDown
        startHeight={awardedItem.indexer?.blockHeight}
        targetHeight={unlockAt}
        prefix="Claimable"
      />
    </NoticeWrapper>
  );
}

function BountyContent({ detail, childBounties, comments }) {
  const { CommentComponent, focusEditor } = useUniversalComments({
    detail,
    comments,
  });

  return (
    <>
      <DetailItem
        onReply={focusEditor}
        countDown={<BountyCountDown data={detail.onchainData} />}
      />
      <Metadata meta={detail.onchainData?.meta} />
      <ChildBountiesTable {...{ childBounties }} />
      <Timeline bounty={detail?.onchainData} />
      {CommentComponent}
    </>
  );
}

export default withLoginUserRedux(({ id, detail, childBounties, comments }) => {
  let breadcrumbItemName = "";
  let postContent = null;

  if (detail) {
    breadcrumbItemName = `#${detail?.bountyIndex}`;
    postContent = (
      <NonNullPost>
        <BountyContent
          detail={detail}
          childBounties={childBounties}
          comments={comments}
        />
      </NonNullPost>
    );
  } else {
    breadcrumbItemName = `#${id}`;
    postContent = <CheckUnFinalized id={id} />;
  }

  const desc = getMetaDesc(detail);

  const breadcrumbItems = [
    {
      content: "Treasury",
    },
    {
      content: "Bounties",
      path: "/treasury/bounties",
    },
    {
      content: breadcrumbItemName,
    },
  ];

  return (
    <PostProvider post={detail}>
      <DetailLayout
        seoInfo={{
          title: detail?.title,
          desc,
          ogImage: getBannerUrl(detail?.bannerCid),
        }}
      >
        <BreadcrumbWrapper>
          <Breadcrumb items={breadcrumbItems} />
        </BreadcrumbWrapper>

        {postContent}
      </DetailLayout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { id, page, page_size } = context.query;
  const pageSize = Math.min(page_size ?? 50, 100);

  const [{ result: detail }, { result: childBounties }] = await Promise.all([
    nextApi.fetch(`treasury/bounties/${id}`),
    nextApi.fetch(`treasury/bounties/${id}/child-bounties`, { pageSize: 5 }),
  ]);

  if (!detail) {
    return {
      props: {
        id,
        detail: null,
        childBounties: EmptyList,
        comments: EmptyList,
      },
    };
  }

  const { result: comments } = await nextApi.fetch(
    `treasury/bounties/${detail._id}/comments`,
    {
      page: page ?? "last",
      pageSize,
    }
  );

  return {
    props: {
      id,
      detail,
      childBounties: childBounties ?? EmptyList,
      comments: comments ?? EmptyList,
    },
  };
});
