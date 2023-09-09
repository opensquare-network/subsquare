import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import getAnnouncementBreadcrumbName from "next-common/utils/alliance/announcementBread";
import { PostProvider } from "next-common/context/post";
import DetailLayout from "next-common/components/layout/DetailLayout";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import { getBannerUrl } from "next-common/utils/banner";
import NonNullPost from "next-common/components/nonNullPost";
import useUniversalComments from "../../../components/universalComments";
import DetailItem from "../../../components/detailItem";
import AnnouncementTimeline from "next-common/components/alliance/announcement/timeline";
import useSubscribePostDetail from "next-common/hooks/useSubscribePostDetail";
import DetailMultiTabs from "next-common/components/detail/detailMultiTabs";
import { fetchDetailComments } from "next-common/services/detail";
import { getNullDetailProps } from "next-common/services/detail/nullDetail";

function AnnouncementContent({ detail, comments }) {
  const { CommentComponent, focusEditor } = useUniversalComments({
    detail,
    comments,
  });

  useSubscribePostDetail(`${detail?.height}_${detail?.cid}`);

  return (
    <>
      <DetailItem onReply={focusEditor} />
      <DetailMultiTabs
        timeline={<AnnouncementTimeline data={detail?.onchainData} />}
      />
      {CommentComponent}
    </>
  );
}

export default withLoginUserRedux(({ id, announcement, comments }) => {
  const breadcrumbItems = [
    {
      content: "Alliance",
    },
    {
      content: "Announcements",
      path: "/alliance/announcements",
    },
    {
      content: getAnnouncementBreadcrumbName(id, announcement),
    },
  ];

  const postContent = (
    <NonNullPost>
      <AnnouncementContent detail={announcement} comments={comments} />
    </NonNullPost>
  );

  return (
    <PostProvider post={announcement}>
      <DetailLayout
        detail={announcement}
        seoInfo={{
          title: announcement?.title,
          desc: getMetaDesc(announcement),
          ogImage: getBannerUrl(announcement?.bannerCid),
        }}
        breadcrumbs={breadcrumbItems}
      >
        {postContent}
      </DetailLayout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
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

  return {
    props: {
      id,
      announcement: announcement ?? null,
      comments: comments ?? EmptyList,
    },
  };
});
