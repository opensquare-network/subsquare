import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider, usePost } from "next-common/context/post";
import CheckUnFinalized from "components/bounty/checkUnFinalized";
import BountyDetail from "next-common/components/detail/treasury/bounty";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import { usePageProps } from "next-common/context/page";
import BountySidebar from "components/bounty/sidebar";
import { OffChainArticleActionsProvider } from "next-common/noSima/context/articleActionsProvider";
import { OffChainCommentActionsProvider } from "next-common/noSima/context/commentActionsProvider";
import { CuratorProvider } from "next-common/context/treasury/bounties";
import { useBountyStatus } from "next-common/components/treasury/bounty/useBountyStatus";
import { useCuratorMultisigAddress } from "next-common/hooks/treasury/bounty/useCuratorMultisigAddress";
import { TreasuryProvider } from "next-common/context/treasury";
import { gov2TracksApi } from "next-common/services/url";
import TreasuryBountiesDetailMultiTabs from "components/tabs/treasuryBountiesDetailMultiTabs";

function useBountyCurator(bountyIndex) {
  const status = useBountyStatus(bountyIndex);
  if (status?.isActive) {
    return status.asActive.curator.toString();
  }
  if (status?.isPendingPayout) {
    return status.asPendingPayout.curator.toString();
  }
  return null;
}

function BountyContent() {
  const detail = usePost();
  const bountyIndex = detail?.bountyIndex;

  useSubscribePostDetail(bountyIndex);

  const curator = useBountyCurator(bountyIndex);
  const curatorParams = useCuratorMultisigAddress(curator);

  return (
    <OffChainArticleActionsProvider>
      <OffChainCommentActionsProvider>
        <CuratorProvider curator={curator} params={curatorParams}>
          <ContentWithComment>
            <BountyDetail />
            <BountySidebar />
            <TreasuryBountiesDetailMultiTabs />
          </ContentWithComment>
        </CuratorProvider>
      </OffChainCommentActionsProvider>
    </OffChainArticleActionsProvider>
  );
}

function BountyContentWithNullGuard() {
  const { id } = usePageProps();
  const detail = usePost();

  if (!detail) {
    return <CheckUnFinalized id={id} />;
  }

  return <BountyContent />;
}

function BountyPageImpl() {
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
      <BountyContentWithNullGuard />
    </DetailLayout>
  );
}

export default function BountyPage({ detail }) {
  return (
    <PostProvider post={detail}>
      <TreasuryProvider>
        <BountyPageImpl />
      </TreasuryProvider>
    </PostProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;
  const [
    { result: detail },
    { result: childBounties },
    { result: tracksDetail },
  ] = await Promise.all([
    backendApi.fetch(`treasury/bounties/${id}`),
    backendApi.fetch(`treasury/bounties/${id}/child-bounties`, { pageSize: 5 }),
    backendApi.fetch(gov2TracksApi),
  ]);

  if (!detail) {
    return getNullDetailProps(id, { childBounties: EmptyList });
  }

  const comments = await fetchDetailComments(
    `treasury/bounties/${detail._id}/comments`,
    context,
  );
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      detail,
      childBounties: childBounties ?? EmptyList,
      comments: comments ?? EmptyList,
      tracksDetail: tracksDetail ?? null,

      ...tracksProps,
    },
  };
});
