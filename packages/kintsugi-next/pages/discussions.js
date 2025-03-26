import { EmptyList } from "next-common/utils/constants";
import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import DiscussionsPage from "@subsquare/next/pages/discussions";

export default DiscussionsPage;

export const getServerSideProps = withCommonProps(async (context) => {
  const { page, page_size: pageSize, label } = context.query;

  let q = { page: page ?? 1, pageSize: pageSize ?? 50, simple: true };
  if (label) {
    q = { label, ...q };
  }
  const { result: posts } = await nextApi.fetch("posts", q);

  const { result: summary } = await nextApi.fetch("overview/summary");

  return {
    props: {
      posts: posts ?? EmptyList,
      summary: summary ?? {},
    },
  };
});
