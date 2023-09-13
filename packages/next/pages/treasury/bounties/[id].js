import { withLoginUser } from "next-common/lib";
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
import DetailLayout from "next-common/components/layout/DetailLayout";
import DetailMultiTabs from "next-common/components/detail/detailMultiTabs";
import useBountyTimelineData from "../../../components/bounty/useBountyTimelineData";
import Timeline from "next-common/components/timeline";
import { detailMultiTabsIsTimelineCompactModeSelector } from "next-common/store/reducers/detailSlice";
import { useSelector } from "react-redux";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";

function BountyContent({ detail, childBounties, comments }) {
  const { CommentComponent, focusEditor } = useUniversalComments({
    detail,
    comments,
  });

  useSubscribePostDetail(detail?.bountyIndex);

  const timelineData = useBountyTimelineData(detail?.onchainData);
  const isTimelineCompact = useSelector(
    detailMultiTabsIsTimelineCompactModeSelector,
  );

  return (
    <>
      <BountyDetail onReply={focusEditor} />
      <DetailMultiTabs
        childBounties={
          !!childBounties.total && <ChildBountiesTable {...{ childBounties }} />
        }
        childBountiesCount={childBounties.total}
        metadata={<Metadata meta={detail.onchainData?.meta} />}
        timeline={<Timeline data={timelineData} compact={isTimelineCompact} />}
        timelineCount={timelineData.length}
      />
      {CommentComponent}
    </>
  );
}

export default function BountyPage({ id, detail, childBounties, comments }) {
  let postContent;
  if (detail) {
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
    postContent = <CheckUnFinalized id={id} />;
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
      >
        {postContent}
      </DetailLayout>
    </PostProvider>
  );
}

export const getServerSideProps = withLoginUser(async (context) => {
  const { id } = context.query;
  const [{ result: detail }, { result: childBounties }] = await Promise.all([
    nextApi.fetch(`treasury/bounties/${id}`),
    nextApi.fetch(`treasury/bounties/${id}/child-bounties`, { pageSize: 5 }),
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

      ...tracksProps,
    },
  };
});
