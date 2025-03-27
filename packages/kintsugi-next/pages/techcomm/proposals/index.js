import { EmptyList } from "next-common/utils/constants";
import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import TechcommProposalsPage from "@subsquare/next/pages/techcomm/proposals";

export default TechcommProposalsPage;

export const getServerSideProps = withCommonProps(async (context) => {
  const chain = process.env.CHAIN;
  const { page, page_size: pageSize } = context.query;

  const [{ result: proposals }, { result: summary }] = await Promise.all([
    nextApi.fetch("tech-comm/motions", {
      page: page ?? 1,
      pageSize: pageSize ?? 50,
      simple: true,
    }),
    nextApi.fetch("overview/summary"),
  ]);

  return {
    props: {
      chain,
      proposals: proposals ?? EmptyList,
      summary: summary ?? {},
    },
  };
});
