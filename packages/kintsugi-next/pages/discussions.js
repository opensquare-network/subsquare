import { EmptyList } from "next-common/utils/constants";
import { withLoginUser } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import DiscussionsPage from "@subsquare/next/pages/discussions";

export default DiscussionsPage;

export const getServerSideProps = withLoginUser(async (context) => {
  const { page, page_size: pageSize, label } = context.query;

  let q = { page: page ?? 1, pageSize: pageSize ?? 50 };
  if (label) {
    q = { label, ...q };
  }
  const { result: posts } = await nextApi.fetch("posts", q);

  return {
    props: {
      posts: posts ?? EmptyList,
    },
  };
});
