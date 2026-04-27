import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { getBannerUrl } from "next-common/utils/banner";
import {
  PostProvider,
  useOnchainData,
  usePost,
} from "next-common/context/post";
import MultiAssetBountyDetail from "next-common/components/detail/treasury/multiAssetBounty";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import MultiAssetBountySidebar from "next-common/components/pages/components/multiAssetBounty/sidebar";
import { OffChainArticleActionsProvider } from "next-common/noSima/context/articleActionsProvider";
import { OffChainCommentActionsProvider } from "next-common/noSima/context/commentActionsProvider";
import { CuratorProvider } from "next-common/context/treasury/bounties";
import { useCuratorMultisigAddress } from "next-common/hooks/treasury/bounty/useCuratorMultisigAddress";
import { TreasuryProvider } from "next-common/context/treasury";
import { gov2TracksApi } from "next-common/services/url";
import MultiAssetBountiesDetailMultiTabs from "next-common/components/pages/components/tabs/multiAssetBountiesDetailMultiTabs";
import { PapiProvider } from "next-common/context/papi";

function useMultiAssetBountyCuratorFromServer() {
  const { curator } = useOnchainData();
  return curator ?? null;
}

function MultiAssetBountyContent() {
  const detail = usePost();
  const bountyIndex = detail?.bountyIndex;

  useSubscribePostDetail(bountyIndex);

  const curator = useMultiAssetBountyCuratorFromServer();
  const curatorParams = useCuratorMultisigAddress(curator);

  return (
    <OffChainArticleActionsProvider>
      <OffChainCommentActionsProvider>
        <CuratorProvider curator={curator} params={curatorParams}>
          <ContentWithComment>
            <MultiAssetBountyDetail />
            <MultiAssetBountySidebar />
            <MultiAssetBountiesDetailMultiTabs />
          </ContentWithComment>
        </CuratorProvider>
      </OffChainCommentActionsProvider>
    </OffChainArticleActionsProvider>
  );
}

function MultiAssetBountyContentWithNullGuard() {
  const detail = usePost();

  if (!detail) {
    return null;
  }

  return (
    <PapiProvider>
      <MultiAssetBountyContent />
    </PapiProvider>
  );
}

function MultiAssetBountyPageImpl() {
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
      <MultiAssetBountyContentWithNullGuard />
    </DetailLayout>
  );
}

export default function MultiAssetBountyPage({ detail }) {
  return (
    <PostProvider post={detail}>
      <TreasuryProvider>
        <MultiAssetBountyPageImpl />
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
    backendApi.fetch(`treasury/multi-asset-bounties/${id}`),
    backendApi.fetch(
      `treasury/multi-asset-bounties/${id}/multi-asset-child-bounties`,
      {
        pageSize: 5,
      },
    ),
    backendApi.fetch(gov2TracksApi),
  ]);

  if (!detail) {
    return getNullDetailProps(id, { childBounties: EmptyList });
  }

  const comments = await fetchDetailComments(
    `treasury/multi-asset-bounties/${detail._id}/comments`,
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
