import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import { to404 } from "next-common/utils/serverSideUtil";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { PostProvider } from "next-common/context/post";
import { fetchDetailComments } from "next-common/services/detail";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import ApplicationDetail from "next-common/components/fellowship/applications/detail";
import FellowshipApplicationBreadcrumb from "next-common/components/fellowship/applications/fellowshipApplicationBreadcrumb";

export default function FellowshipApplicationDetailPage({ detail }) {
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
  const { result: detail } = await nextApi.fetch(
    `fellowship/applications/${id}`,
  );

  if (!detail) {
    return to404();
  }

  const tracksProps = await fetchOpenGovTracksProps();
  const comments = await fetchDetailComments(
    `fellowship/applications/${detail._id}/comments`,
    context,
  );

  return {
    props: {
      detail,
      comments: comments ?? EmptyList,
      ...tracksProps,
    },
  };
});
