import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { PostProvider } from "next-common/context/post";
import { fetchDetailComments } from "next-common/services/detail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import ApplicationDetail from "next-common/components/fellowship/applications/detail";
import FellowshipApplicationBreadcrumb from "next-common/components/fellowship/applications/fellowshipApplicationBreadcrumb";
import NotFoundDetail from "next-common/components/notFoundDetail";

export default function FellowshipApplicationDetailPage({ detail }) {
  if (!detail) {
    return (
      <NotFoundDetail
        breadcrumbItems={[
          {
            path: "/fellowship",
            content: "Fellowship",
          },
          {
            path: "/fellowship/applications",
            content: "Applications",
          },
        ]}
      />
    );
  }

  const desc = getMetaDesc(detail);
  return (
    <PostProvider post={detail}>
      <DetailLayout
        breadcrumbs={<FellowshipApplicationBreadcrumb />}
        seoInfo={{
          title: detail?.title,
          desc,
        }}
      >
        <ApplicationDetail />
      </DetailLayout>
    </PostProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;
  const { result: detail = null } = await backendApi.fetch(
    `fellowship/applications/${id}`,
  );

  const tracksProps = await fetchOpenGovTracksProps();
  const comments = detail
    ? await fetchDetailComments(
        `fellowship/applications/${detail?._id}/comments`,
        context,
      )
    : null;
  return {
    props: {
      detail,
      comments: comments ?? EmptyList,
      ...tracksProps,
    },
  };
});
