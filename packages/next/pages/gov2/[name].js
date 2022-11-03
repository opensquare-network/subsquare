import { withLoginUser } from "next-common/lib";
import { EmptyList } from "next-common/utils/constants";
import { parseGov2Name } from "next-common/utils/gov2";
import Gov2Page from ".";

export default Gov2Page;

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { page, page_size: pageSize, name } = context.query;
  // TODO: fetch posts

  return {
    props: {
      chain,
      posts: EmptyList,
      title: parseGov2Name(name),
    },
  };
});
