import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import { PostProvider, usePost } from "next-common/context/post";
import DetailLayout from "next-common/components/layout/DetailLayout";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { getBannerUrl } from "next-common/utils/banner";
import NonNullPost from "next-common/components/nonNullPost";
import DetailItem from "../../../components/detailItem";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import ContentWithComment from "next-common/components/detail/common/contentWithComment";
import { OffChainArticleActionsProvider } from "next-common/noSima/context/articleActionsProvider";
import { OffChainCommentActionsProvider } from "next-common/noSima/context/commentActionsProvider";
import AllianceAnnouncementsDetailMultiTabs from "components/tabs/allianceAnnouncementsDetailMultiTabs";

function AnnouncementContent() {
  const detail = usePost();

  useSubscribePostDetail(`${detail?.height}_${detail?.cid}`);

  return (
    <OffChainArticleActionsProvider>
      <OffChainCommentActionsProvider>
        <ContentWithComment>
          <DetailItem />
          <AllianceAnnouncementsDetailMultiTabs />
        </ContentWithComment>
      </OffChainCommentActionsProvider>
    </OffChainArticleActionsProvider>
  );
}

function AnnouncementPageImpl() {
  const announcement = usePost();

  return (
    <DetailLayout
      seoInfo={{
        title: announcement?.title,
        desc: getMetaDesc(announcement),
        ogImage: getBannerUrl(announcement?.bannerCid),
      }}
    >
      <NonNullPost>
        <AnnouncementContent />
      </NonNullPost>
    </DetailLayout>
  );
}

export default function AnnouncementPage({ announcement }) {
  return (
    <PostProvider post={announcement}>
      <AnnouncementPageImpl />
    </PostProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;
  const { result: announcement } = await backendApi.fetch(
    `alliance/announcements/${id}`,
  );
  if (!announcement) {
    return getNullDetailProps(id, { announcement: null });
  }

  const comments = await fetchDetailComments(
    `alliance/announcements/${announcement._id}/comments`,
    context,
  );
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      ...tracksProps,
      announcement: announcement ?? null,
      comments: comments ?? EmptyList,
    },
  };
});
