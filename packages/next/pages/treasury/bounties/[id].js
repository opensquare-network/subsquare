import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import Metadata from "next-common/components/treasury/bounty/metadata";
import ChildBountiesTable from "../../../components/bounty/childBountiesTable";
import useUniversalComments from "components/universalComments";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider } from "next-common/context/post";
import CheckUnFinalized from "components/bounty/checkUnFinalized";
import NonNullPost from "next-common/components/nonNullPost";
import BountyDetail from "next-common/components/detail/treasury/bounty";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";
import DetailLayout from "next-common/components/layout/DetailLayout";
import DetailMultiTabs from "next-common/components/detail/detailMultiTabs";
import useBountyTimelineData from "../../../components/bounty/useBountyTimelineData";
import Timeline from "next-common/components/timeline";

function BountyContent({ detail, childBounties, comments }) {
  const { CommentComponent, focusEditor } = useUniversalComments({
    detail,
    comments,
  });

  useSubscribePostDetail(detail?.bountyIndex);

  const timelineData = useBountyTimelineData(detail?.onchainData);

  return (
    <>
      <BountyDetail onReply={focusEditor} />
      <DetailMultiTabs
        childBounties={
          !!childBounties.total && <ChildBountiesTable {...{ childBounties }} />
        }
        childBountiesCount={childBounties.total}
        metadata={<Metadata meta={detail.onchainData?.meta} />}
        timeline={<Timeline data={timelineData} />}
        timelineCount={timelineData.length}
      />
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
        breadcrumbs={breadcrumbItems}
        seoInfo={{
          title: detail?.title,
          desc,
          ogImage: getBannerUrl(detail?.bannerCid),
        }}
      >
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
    },
  );

  const [{ result: tracks }, { result: fellowshipTracks }] = await Promise.all([
    nextApi.fetch(gov2TracksApi),
    nextApi.fetch(fellowshipTracksApi),
  ]);

  return {
    props: {
      id,
      detail,
      childBounties: childBounties ?? EmptyList,
      comments: comments ?? EmptyList,

      tracks,
      fellowshipTracks,
    },
  };
});
