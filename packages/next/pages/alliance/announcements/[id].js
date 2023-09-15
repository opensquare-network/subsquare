import { withCommonProps } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import { PostProvider, usePost } from "next-common/context/post";
import DetailLayout from "next-common/components/layout/DetailLayout";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { getBannerUrl } from "next-common/utils/banner";
import NonNullPost from "next-common/components/nonNullPost";
import DetailItem from "../../../components/detailItem";
import AnnouncementTimeline from "next-common/components/alliance/announcement/timeline";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import DetailMultiTabs from "next-common/components/detail/detailMultiTabs";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import ContentWithUniversalComment from "components/details/contentWithUniversalComment";
import { usePageProps } from "next-common/context/page";

function AnnouncementContent() {
  const detail = usePost();
  const { comments } = usePageProps();

  useSubscribePostDetail(`${detail?.height}_${detail?.cid}`);

  return (
    <ContentWithUniversalComment comments={comments}>
      <DetailItem />
      <DetailMultiTabs
        timeline={<AnnouncementTimeline data={detail?.onchainData} />}
      />
    </ContentWithUniversalComment>
  );
}

function AnnouncementPageImpl() {
  const announcement = usePost();

  return (
    <DetailLayout
      detail={announcement}
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
  const { result: announcement } = await nextApi.fetch(
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
