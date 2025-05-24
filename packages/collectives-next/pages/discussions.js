import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import DiscussionsPage from "@subsquare/next/pages/discussions";

export default DiscussionsPage;

export const getServerSideProps = withCommonProps(async (context) => {
  const { page, page_size: pageSize, label } = context.query;

  let q = {
    page: page ?? 1,
    pageSize: pageSize ?? defaultPageSize,
    simple: true,
  };
  if (label) {
    q = { label, ...q };
  }
  const { result: posts } = await backendApi.fetch("posts", q);
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      posts: posts ?? EmptyList,
      ...tracksProps,
    },
  };
});
